"""
Shared scene setup for the Praverse hero renders.

Material language (brief section 4): white ceramic, brushed aluminium,
frosted glass, emissive teal #4BD6C4 and amber #E8A23A, on a light-gray
studio ground matching --paper #EEEDEA.

Everything here is procedural. No downloaded models, no external textures.

Blender 5.x: the EEVEE identifier is BLENDER_EEVEE_NEXT and Principled BSDF
uses "Transmission Weight" / "Emission Color"; both are handled defensively
so the scripts survive small API drift.
"""

import argparse
import math
import sys

import bpy
from mathutils import Vector

# Brand colours, linear-ish sRGB values fed straight to Principled.
PAPER = (0.933, 0.929, 0.918, 1.0)      # #EEEDEA
TEAL = (0.294, 0.839, 0.769, 1.0)       # #4BD6C4
AMBER = (0.910, 0.635, 0.227, 1.0)      # #E8A23A
CERAMIC = (0.94, 0.94, 0.93, 1.0)
ALUMINIUM = (0.62, 0.63, 0.64, 1.0)


# --------------------------------------------------------------------------- cli

def parse_args():
    """Parse args after the `--` separator Blender passes through."""
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True, help="output directory for frames")
    p.add_argument("--res", default="1600x900", help="WIDTHxHEIGHT")
    p.add_argument("--frames", type=int, default=120)
    p.add_argument("--samples", type=int, default=24)
    p.add_argument("--contact", action="store_true",
                   help="render only frames 1/40/80/120 as a look test")
    return p.parse_args(argv)


# ------------------------------------------------------------------- scene reset

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.world = bpy.data.worlds.new("PraverseWorld")
    return scene


def _pick_engine(scene):
    """
    EEVEE's identifier has moved around: BLENDER_EEVEE (<=4.1),
    BLENDER_EEVEE_NEXT (4.2–4.5), BLENDER_EEVEE again (5.x).
    Pick whichever this build actually offers.
    """
    prop = scene.render.bl_rna.properties["engine"]
    available = {item.identifier for item in prop.enum_items}
    for candidate in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        if candidate in available:
            return candidate
    return "CYCLES"


def set_render(scene, width, height, frames, samples):
    scene.render.engine = _pick_engine(scene)
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.frame_start = 1
    scene.frame_end = frames

    ee = scene.eevee
    _try(ee, "taa_render_samples", samples)
    _try(ee, "use_raytracing", True)
    _try(ee, "use_bloom", False)          # removed in 5.x; harmless if absent
    _try(ee, "use_shadow_jitter_viewport", True)

    # AgX keeps the bright studio from clipping; fall back if unavailable.
    _try_enum(scene.view_settings, "view_transform", ("AgX", "Filmic", "Standard"))
    _try_enum(
        scene.view_settings,
        "look",
        ("AgX - Base Contrast", "Base Contrast", "None"),
    )


def _try_enum(obj, attr, candidates):
    """Set an enum to the first candidate this build accepts."""
    for value in candidates:
        try:
            setattr(obj, attr, value)
            return value
        except TypeError:
            continue
    return None


def _try(obj, attr, value):
    """Set an attribute only if this Blender build has it."""
    if hasattr(obj, attr):
        try:
            setattr(obj, attr, value)
        except Exception:
            pass


# --------------------------------------------------------------------- materials

def _principled(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    return mat, mat.node_tree.nodes["Principled BSDF"]


def _set(node, key, value):
    """Set a Principled input by name, tolerating version renames."""
    if key in node.inputs:
        node.inputs[key].default_value = value
        return True
    return False


def mat_ceramic(name="Ceramic", colour=CERAMIC):
    mat, n = _principled(name)
    _set(n, "Base Color", colour)
    _set(n, "Roughness", 0.35)
    _set(n, "Metallic", 0.0)
    # subtle sheen so the ceramic reads soft rather than plastic
    _set(n, "Specular IOR Level", 0.45) or _set(n, "Specular", 0.45)
    return mat


def mat_aluminium(name="Aluminium"):
    mat, n = _principled(name)
    _set(n, "Base Color", ALUMINIUM)
    _set(n, "Metallic", 1.0)
    _set(n, "Roughness", 0.32)
    # anisotropy reads as a brushed finish
    _set(n, "Anisotropic", 0.6)
    return mat


def mat_glass(name="FrostedGlass"):
    mat, n = _principled(name)
    _set(n, "Base Color", (0.9, 0.93, 0.94, 1.0))
    _set(n, "Roughness", 0.22)
    if not _set(n, "Transmission Weight", 0.92):
        _set(n, "Transmission", 0.92)
    _set(n, "IOR", 1.45)
    mat.blend_method = "BLEND" if hasattr(mat, "blend_method") else mat.blend_method
    return mat


def mat_emissive(name, colour, strength=6.0):
    """Pure light source. For seams prefer mat_seam()."""
    mat, n = _principled(name)
    _set(n, "Base Color", (0.02, 0.02, 0.02, 1.0))
    _set(n, "Roughness", 0.4)
    if not _set(n, "Emission Color", colour):
        _set(n, "Emission", colour)
    _set(n, "Emission Strength", strength)
    return mat


def mat_seam(name, colour, strength=0.0, tint=0.0):
    """
    A seam that is pale ceramic when unlit and glows `colour` when lit.

    The base colour matters: an unlit seam with a near-black base reads as a
    gouge cut into the model rather than a light that happens to be off.

    `tint` (0–1) blends the base toward the lit colour. AgX compresses bright
    emissives toward white, so a tinted base is what actually keeps amber
    reading as amber and teal as teal — raising Emission Strength alone just
    makes both go cream.
    """
    mat, n = _principled(name)
    pale = (0.88, 0.89, 0.89, 1.0)
    base = tuple(pale[i] * (1 - tint) + colour[i] * tint for i in range(3)) + (1.0,)
    _set(n, "Base Color", base)
    _set(n, "Roughness", 0.25)
    _set(n, "Metallic", 0.0)
    if not _set(n, "Emission Color", colour):
        _set(n, "Emission", colour)
    _set(n, "Emission Strength", strength)
    return mat


def emission_input(mat):
    """The Emission Strength socket, for keyframing."""
    n = mat.node_tree.nodes["Principled BSDF"]
    return n.inputs["Emission Strength"]


# ------------------------------------------------------------------------ studio

def build_studio(scene, ground=True, ground_colour=None):
    """Soft studio: gradient world matching --paper plus large area lights."""
    world = scene.world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()

    bg = nt.nodes.new("ShaderNodeBackground")
    grad = nt.nodes.new("ShaderNodeTexGradient")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    mapping = nt.nodes.new("ShaderNodeMapping")
    tex_co = nt.nodes.new("ShaderNodeTexCoord")
    out = nt.nodes.new("ShaderNodeOutputWorld")

    # Darker at the bottom, bright above: gives the subject an edge to sit
    # against instead of dissolving into a uniform white field.
    mapping.inputs["Rotation"].default_value = (math.radians(90), 0, 0)
    ramp.color_ramp.elements[0].position = 0.30
    ramp.color_ramp.elements[0].color = (0.40, 0.40, 0.40, 1.0)
    ramp.color_ramp.elements[1].position = 0.92
    ramp.color_ramp.elements[1].color = (0.95, 0.95, 0.94, 1.0)
    bg.inputs["Strength"].default_value = 0.85

    nt.links.new(tex_co.outputs["Generated"], mapping.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], grad.inputs["Vector"])
    nt.links.new(grad.outputs["Color"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])

    # Key is tight and strong for a readable shadow; fill stays soft and low
    # so the form keeps its modelling instead of flattening out.
    for name, loc, rot, size, power in (
        ("Key", (4.6, -5.2, 6.8), (math.radians(40), 0, math.radians(40)), 5.0, 2600),
        ("Fill", (-6.4, -3.6, 3.0), (math.radians(68), 0, math.radians(-56)), 12.0, 260),
        ("Rim", (-1.8, 6.8, 5.2), (math.radians(118), 0, math.radians(10)), 7.0, 900),
    ):
        data = bpy.data.lights.new(name, type="AREA")
        data.shape = "RECTANGLE"
        data.size = size
        data.size_y = size * 0.72
        data.energy = power
        obj = bpy.data.objects.new(name, data)
        obj.location = loc
        obj.rotation_euler = rot
        scene.collection.objects.link(obj)

    if ground:
        bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
        plane = bpy.context.object
        plane.name = "Ground"
        plane.data.materials.append(
            mat_ceramic("GroundMat", ground_colour or PAPER)
        )


def add_camera(scene, location, look_at=(0, 0, 0), lens=42.0, fstop=2.8):
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = lens
    cam_data.dof.use_dof = True
    cam_data.dof.aperture_fstop = fstop

    cam = bpy.data.objects.new("Camera", cam_data)
    cam.location = location
    scene.collection.objects.link(cam)
    scene.camera = cam

    target = bpy.data.objects.new("CamTarget", None)
    target.location = look_at
    scene.collection.objects.link(target)

    track = cam.constraints.new("TRACK_TO")
    track.target = target
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"

    cam_data.dof.focus_object = target
    return cam, target


# ----------------------------------------------------------------------- helpers

def smooth(obj, angle=36):
    """
    Shade smooth but keep hard edges on bevels.

    How this is expressed moved repeatedly: mesh.use_auto_smooth (<=4.0),
    a "Smooth by Angle" geometry-nodes asset (4.1–4.5), and the
    shade_auto_smooth operator (5.x). Try them in order.
    """
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    if hasattr(bpy.ops.object, "shade_auto_smooth"):
        try:
            bpy.ops.object.shade_auto_smooth(angle=math.radians(angle))
            obj.select_set(False)
            return
        except Exception:
            pass

    bpy.ops.object.shade_smooth()
    if hasattr(obj.data, "use_auto_smooth"):
        obj.data.use_auto_smooth = True
        obj.data.auto_smooth_angle = math.radians(angle)
    obj.select_set(False)


def key(obj, path, frame, value):
    """Keyframe any property. Easing is applied globally by ease_all()."""
    parts = path.split(".")
    target = obj
    for p in parts[:-1]:
        target = getattr(target, p)
    setattr(target, parts[-1], value)
    target.keyframe_insert(data_path=parts[-1], frame=frame)


def key_socket(socket, frame, value):
    socket.default_value = value
    socket.keyframe_insert("default_value", frame=frame)


def _iter_fcurves(action):
    """
    Yield every fcurve in an action.

    Blender 4.4 introduced slotted actions and 5.0 removed Action.fcurves,
    moving curves into layers → strips → channelbags.
    """
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return

    for layer in getattr(action, "layers", []):
        for strip in getattr(layer, "strips", []):
            bags = getattr(strip, "channelbags", None)
            if bags is None:
                continue
            for bag in bags:
                yield from bag.fcurves


def ease_all(interp="BEZIER", easing="EASE_IN_OUT"):
    """Apply a consistent ease to every keyframe in the scene."""
    for action in bpy.data.actions:
        for fc in _iter_fcurves(action):
            for kp in fc.keyframe_points:
                kp.interpolation = interp
                kp.easing = easing


def render_frames(scene, out_dir, contact=False, frames=120):
    """Render the sequence, or just a 4-frame contact sheet."""
    import os
    os.makedirs(out_dir, exist_ok=True)

    if contact:
        picks = [1, max(1, frames // 3), max(1, (frames * 2) // 3), frames]
        for f in picks:
            scene.frame_set(f)
            scene.render.filepath = os.path.join(out_dir, f"contact-{f:04d}.png")
            bpy.ops.render.render(write_still=True)
        return

    scene.render.filepath = os.path.join(out_dir, "frame-")
    scene.render.image_settings.file_format = "PNG"
    bpy.ops.render.render(animation=True)
