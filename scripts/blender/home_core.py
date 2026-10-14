"""
Home hero — "Four lines, one core".

A white ceramic core rests on a soft gray plinth. A thin orbital ring draws
itself around the core, then four modules dock onto the ring one at a time,
each lighting its teal seams as it locks in:

    1 Enterprise AI → 2 Pharma AI → 3 Healthcare AI (MENNIE) → 4 Photonics

Final frames hold on all four lit with a slow idle drift.

Geometry is original and deliberately abstract — a core, a ring, four docking
modules — so it cannot read as anyone else's product.

Usage:
    blender -b -P scripts/blender/home_core.py -- --out <dir> --res 1600x900 --frames 120
    blender -b -P scripts/blender/home_core.py -- --out <dir> --contact
"""

import math
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402
from _common import (  # noqa: E402
    CERAMIC, TEAL,
    add_camera, build_studio, ease_all, emission_input, evaluated_location,
    export_positions, key, key_socket,
    mat_aluminium, mat_ceramic, mat_glass, mat_seam,
    parse_args, render_frames, reset_scene, set_render, smooth,
)

RING_R = 3.05
RING_TILT = math.radians(13)
CORE_H = 0.95          # half-height of the core cube
CORE_Z = 1.18          # core centre height above the plinth top

# Where each module docks on the ring, in docking order, each carrying its
# business line's accent so the hero and the page speak the same colour
# language: violet -> emerald -> sky -> amber.
MODULES = [
    {"name": "EnterpriseAI", "angle": 48, "kind": "agent",
     "colour": (0.486, 0.361, 1.000, 1.0)},   # #7C5CFF violet
    {"name": "PharmaAI", "angle": 138, "kind": "vial",
     "colour": (0.063, 0.725, 0.506, 1.0)},   # #10B981 emerald
    {"name": "Healthcare", "angle": 228, "kind": "voice",
     "colour": (0.220, 0.741, 0.973, 1.0)},   # #38BDF8 sky
    {"name": "Photonics", "angle": 318, "kind": "optic",
     "colour": (0.961, 0.620, 0.043, 1.0)},   # #F59E0B amber
]


def ring_point(angle_rad, radius=RING_R):
    """A point on the tilted orbital ring, in world space."""
    x = math.cos(angle_rad) * radius
    y = math.sin(angle_rad) * radius
    # tilt about the X axis
    z = CORE_Z + math.sin(angle_rad) * math.sin(RING_TILT) * radius * 0.0
    y_t = y * math.cos(RING_TILT)
    z_t = CORE_Z + y * math.sin(RING_TILT)
    return (x, y_t, z_t)


def build_plinth(dark=False):
    """Low, wide cylinder. Darker than the ground so the core sits on something."""
    bpy.ops.mesh.primitive_cylinder_add(radius=3.1, depth=0.34, location=(0, 0, 0.17))
    plinth = bpy.context.object
    plinth.name = "Plinth"
    bev = plinth.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.045
    bev.segments = 8
    bev.limit_method = "ANGLE"
    plinth_col = (0.075, 0.095, 0.165, 1.0) if dark else (0.855, 0.865, 0.885, 1.0)
    plinth.data.materials.append(mat_ceramic("PlinthMat", plinth_col))
    smooth(plinth, angle=30)

    # Polished ceramic recess. A frosted-glass disc here renders as flat
    # grey noise in EEVEE, which reads as sandpaper rather than glass.
    bpy.ops.mesh.primitive_cylinder_add(
        radius=2.55, depth=0.06, location=(0, 0, 0.36), vertices=96
    )
    inlay = bpy.context.object
    inlay.name = "PlinthInlay"
    inlay_col = (0.115, 0.140, 0.225, 1.0) if dark else (0.70, 0.715, 0.745, 1.0)
    inlay_mat = mat_ceramic("PlinthInlayMat", inlay_col)
    inlay_mat.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.12
    inlay.data.materials.append(inlay_mat)
    smooth(inlay, angle=30)

    return plinth


def build_core():
    """
    Rounded ceramic core: a bevelled cube that still reads as a cube.

    No subdivision surface — that turns it into a lumpy sphere and loses the
    engineered feel the hero is supposed to carry.
    """
    bpy.ops.mesh.primitive_cube_add(size=CORE_H * 2, location=(0, 0, CORE_Z))
    core = bpy.context.object
    core.name = "Core"

    bev = core.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.30
    bev.segments = 14
    bev.limit_method = "ANGLE"
    bev.harden_normals = True

    core.data.materials.append(mat_ceramic("CoreMat", CERAMIC))
    smooth(core, angle=52)

    return core


def build_ring():
    """
    Open (non-cyclic) poly spline so bevel_factor_end can draw it on.

    A cyclic spline ignores bevel factors entirely, which is why the ring has
    to be an almost-closed arc rather than a true circle.
    """
    curve = bpy.data.curves.new("RingCurve", type="CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = 0.036
    curve.bevel_resolution = 6
    curve.use_fill_caps = True

    pts = 128
    spline = curve.splines.new("POLY")
    spline.points.add(pts - 1)
    for i in range(pts):
        a = (i / (pts - 1)) * math.tau * 0.999
        x, y, z = ring_point(a)
        spline.points[i].co = (x, y, z, 1.0)

    ring = bpy.data.objects.new("Ring", curve)
    bpy.context.scene.collection.objects.link(ring)
    ring.data.materials.append(mat_aluminium("RingMat"))
    return ring


def build_module(spec, index):
    """
    A docking module: a small brushed-aluminium block with a ceramic cap and a
    recessed seam that lights teal once it locks in.
    """
    a = math.radians(spec["angle"])
    pos = ring_point(a)

    # body
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=pos)
    body = bpy.context.object
    body.name = f"Module_{spec['name']}"
    body.scale = (0.60, 0.40, 0.50)
    body.rotation_euler = (RING_TILT * math.cos(a), 0, a)
    bev = body.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.045
    bev.segments = 6
    bev.limit_method = "ANGLE"
    bev.harden_normals = True
    body.data.materials.append(tinted(f"ModBody_{index}", spec["colour"], 0.22))
    smooth(body, angle=45)

    # brushed collar where it meets the ring
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=pos)
    collar = bpy.context.object
    collar.name = f"Collar_{spec['name']}"
    collar.scale = (0.25, 0.46, 0.56)
    collar.rotation_euler = body.rotation_euler
    collar.data.materials.append(mat_aluminium(f"ModCollar_{index}"))
    smooth(collar, angle=45)

    # seam: thin slab proud of the outer face. Unlit it is pale ceramic, not
    # black — an unlit black bar reads as a hole in the model.
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=pos)
    seam = bpy.context.object
    seam.name = f"Seam_{spec['name']}"
    seam.scale = (0.635, 0.110, 0.255)
    seam.rotation_euler = body.rotation_euler
    seam_mat = mat_seam(f"SeamMat_{index}", spec["colour"], strength=0.0, tint=0.92)
    seam.data.materials.append(seam_mat)

    # --- the part that says which business this is ----------------------
    # An abstract block tells a visitor nothing. Each module carries a shape
    # its industry would recognise, in that line's colour.
    parts = [body, collar, seam] + build_module_detail(
        spec, index, pos, body.rotation_euler, seam_mat
    )

    # Rim light on the core in the same colour, so the core picks up each
    # line's accent as that module locks in rather than staying inert white.
    rim_data = bpy.data.lights.new(f"Rim_{spec['name']}", type="AREA")
    rim_data.shape = "RECTANGLE"
    rim_data.size = 0.9
    rim_data.size_y = 0.7
    rim_data.color = spec["colour"][:3]
    rim_data.energy = 0.0
    rim = bpy.data.objects.new(f"RimLight_{spec['name']}", rim_data)
    # between the module and the core, aimed inward
    rim.location = (pos[0] * 0.70, pos[1] * 0.70, pos[2] + 0.18)
    rim.rotation_euler = (math.radians(86), 0, a + math.pi / 2)
    bpy.context.scene.collection.objects.link(rim)

    return parts, seam_mat, pos, a, rim


def tinted(name, colour, amount=0.80):
    """Soft matte in a line's colour. Keeps the ceramic feel, adds identity."""
    base = tuple(
        0.93 * (1 - amount) + colour[i] * amount for i in range(3)
    ) + (1.0,)
    return mat_ceramic(name, base)


def build_module_detail(spec, index, pos, rot, seam_mat):
    """
    The domain-recognisable part of each module.

      agent  Enterprise AI - a slim slab with two floating document cards
      vial   Pharma AI     - a capsule with a hex-lattice etch band
      voice  Healthcare    - a shell segment with a sound-wave strip
      optic  Photonics     - a transceiver block with a short fibre tail

    Each sits on the outward face of its module, so the camera sees it as the
    module docks.
    """
    kind = spec["kind"]
    colour = spec["colour"]
    x, y, z = pos
    yaw = rot[2]
    out = []

    def place(obj, dx=0.0, dy=0.0, dz=0.0):
        """Offset along the module's own axes, keeping its rotation."""
        obj.location = (
            x + dx * math.cos(yaw) - dy * math.sin(yaw),
            y + dx * math.sin(yaw) + dy * math.cos(yaw),
            z + dz,
        )
        obj.rotation_euler = rot
        out.append(obj)
        return obj

    if kind == "agent":
        # two document cards hanging above the module, fanned
        for i, (dy, dz, sc) in enumerate(((-0.17, 0.78, 1.0), (0.19, 0.95, 0.82))):
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            card = bpy.context.object
            card.name = f"Doc_{index}_{i}"
            card.scale = (0.022, 0.30 * sc, 0.38 * sc)
            card.data.materials.append(
                tinted(f"DocMat_{index}_{i}", colour, 0.30)
            )
            place(card, 0.0, dy, dz)
            # lines of text, the top one lit: the agent has read this page
            for j, (ly, lw, lit) in enumerate(
                ((0.10, 0.20, True), (0.02, 0.24, False), (-0.06, 0.16, False))
            ):
                bpy.ops.mesh.primitive_cube_add(size=1.0)
                line = bpy.context.object
                line.name = f"DocLine_{index}_{i}_{j}"
                line.scale = (0.027, lw * sc, 0.022 * sc)
                line.data.materials.append(
                    seam_mat
                    if lit
                    else tinted(f"DocLineMat_{index}_{i}_{j}", colour, 0.55)
                )
                place(line, 0.0, dy, dz + ly * sc)

    elif kind == "vial":
        # a capsule standing above the module
        bpy.ops.mesh.primitive_cylinder_add(radius=0.19, depth=0.60, vertices=48)
        cap = bpy.context.object
        cap.name = f"Vial_{index}"
        bev = cap.modifiers.new("Bevel", "BEVEL")
        bev.width = 0.085
        bev.segments = 10
        bev.limit_method = "ANGLE"
        cap.data.materials.append(tinted(f"VialMat_{index}", colour, 0.62))
        smooth(cap, angle=40)
        place(cap, 0.0, 0.0, 0.88)

        # hex-lattice band around its waist
        for i in range(10):
            ang = (i / 10) * math.tau
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            hexb = bpy.context.object
            hexb.name = f"Hex_{index}_{i}"
            hexb.scale = (0.030, 0.030, 0.075)
            hexb.data.materials.append(seam_mat)
            o = place(
                hexb,
                math.cos(ang) * 0.195,
                math.sin(ang) * 0.195,
                0.88,
            )
            o.rotation_euler = (rot[0], rot[1], yaw + ang)

    elif kind == "voice":
        # a smooth shell segment above the module
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.33, segments=44, ring_count=22)
        shell = bpy.context.object
        shell.name = f"Shell_{index}"
        shell.scale = (0.46, 1.0, 1.05)
        shell.data.materials.append(
            tinted(f"ShellMat_{index}", colour, 0.34)
        )
        smooth(shell, angle=50)
        place(shell, 0.0, 0.0, 0.86)

        # sound-wave strip across its face, echoing MENNIE's spine seam
        heights = (0.06, 0.13, 0.23, 0.15, 0.30, 0.17, 0.10, 0.19, 0.07)
        for i, h in enumerate(heights):
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            bar = bpy.context.object
            bar.name = f"Wave_{index}_{i}"
            bar.scale = (0.020, 0.022, h)
            bar.data.materials.append(seam_mat)
            place(bar, 0.17, (i - 4) * 0.062, 0.86)

    elif kind == "optic":
        # a transceiver block above the module
        bpy.ops.mesh.primitive_cube_add(size=1.0)
        tx = bpy.context.object
        tx.name = f"Tx_{index}"
        tx.scale = (0.24, 0.44, 0.24)
        bev = tx.modifiers.new("Bevel", "BEVEL")
        bev.width = 0.028
        bev.segments = 5
        bev.limit_method = "ANGLE"
        tx.data.materials.append(tinted(f"TxMat_{index}", colour, 0.58))
        smooth(tx, angle=45)
        place(tx, 0.0, 0.0, 0.86)

        # amber contact fingers on its electrical edge
        for i in range(7):
            bpy.ops.mesh.primitive_cube_add(size=1.0)
            fing = bpy.context.object
            fing.name = f"Fing_{index}_{i}"
            fing.scale = (0.026, 0.022, 0.042)
            fing.data.materials.append(seam_mat)
            place(fing, 0.225, (i - 3) * 0.058, 0.80)

        # a fibre tail arcing away, carrying light
        curve = bpy.data.curves.new(f"FibreTailCurve_{index}", type="CURVE")
        curve.dimensions = "3D"
        curve.bevel_depth = 0.022
        curve.bevel_resolution = 5
        sp = curve.splines.new("POLY")
        n = 18
        sp.points.add(n - 1)
        for i in range(n):
            t = i / (n - 1)
            dy = 0.22 + t * 0.95
            dz = 0.86 + math.sin(t * 1.5) * 0.30 - t * 0.55
            sp.points[i].co = (
                x - dy * math.sin(yaw),
                y + dy * math.cos(yaw),
                z + dz,
                1.0,
            )
        fib = bpy.data.objects.new(f"FibreTail_{index}", curve)
        bpy.context.scene.collection.objects.link(fib)
        fib.data.materials.append(
            mat_seam(f"FibreTailMat_{index}", TEAL, strength=2.6, tint=0.92)
        )
        out.append(fib)

    return out


def animate(scene, ring, modules, core, cam, target, frames):
    """
    Timeline (as a fraction of the sequence):
        0.00–0.20   ring draws around the core
        0.20–0.90   four modules dock and light, one at a time
        0.90–1.00   all four lit, slow idle
    """
    f_end = frames

    # --- ring draws on -----------------------------------------------------
    ring.data.bevel_factor_end = 0.0
    ring.data.keyframe_insert("bevel_factor_end", frame=1)
    ring.data.bevel_factor_end = 1.0
    ring.data.keyframe_insert("bevel_factor_end", frame=int(f_end * 0.20))

    # --- modules dock ------------------------------------------------------
    span = 0.70 / len(modules)
    for i, (parts, seam_mat, pos, angle, rim) in enumerate(modules):
        start = 0.20 + i * span
        land = start + span * 0.60
        lit = start + span * 0.82

        f_start = max(2, int(f_end * start))
        f_land = int(f_end * land)
        f_lit = int(f_end * lit)

        # fly in outward along the ring radius, slightly above
        ox, oy, oz = pos
        far = (ox * 3.4, oy * 3.4, oz + 1.6)

        for obj in parts:
            key(obj, "location", f_start, far)
            key(obj, "location", f_land, pos)

        strength = emission_input(seam_mat)
        key_socket(strength, f_start, 0.0)
        key_socket(strength, f_land, 0.0)
        key_socket(strength, f_lit, 2.4)
        key_socket(strength, f_end, 2.0)

        # Rim light rises with the seam and stays on, so the core itself picks
        # up each line's colour instead of staying inert white.
        key(rim.data, "energy", f_land, 0.0)
        key(rim.data, "energy", f_lit, 240.0)
        key(rim.data, "energy", f_end, 190.0)

    # --- camera: slow push in, ending closer and a touch lower -------------
    key(cam, "location", 1, (7.6, -8.7, 6.1))
    key(cam, "location", int(f_end * 0.5), (7.1, -8.1, 5.75))
    key(cam, "location", f_end, (6.5, -7.4, 5.3))

    key(target, "location", 1, (0, 0, CORE_Z))
    key(target, "location", f_end, (0, 0, CORE_Z + 0.08))

    # core breathes very slightly so the hold frame is not dead
    for obj in (core,):
        s = obj.scale.copy()
        key(obj, "scale", 1, s)
        key(obj, "scale", int(f_end * 0.5), (s[0] * 1.01, s[1] * 1.01, s[2] * 1.01))
        key(obj, "scale", f_end, s)


def main():
    args = parse_args()
    width, height = (int(v) for v in args.res.lower().split("x"))

    scene = reset_scene()
    set_render(scene, width, height, args.frames, args.samples)
    build_studio(scene, ground=True, dark=args.dark)

    build_plinth(dark=args.dark)
    core = build_core()
    ring = build_ring()
    modules = [build_module(spec, i) for i, spec in enumerate(MODULES)]

    cam, target = add_camera(
        scene, location=(7.6, -8.7, 6.1), look_at=(0, 0, CORE_Z), lens=50.0, fstop=3.6
    )

    animate(scene, ring, modules, core, cam, target, args.frames)
    ease_all()

    if not args.contact:
        # Screen-space tracks so the site can draw a live canvas overlay that
        # sits exactly on the render: light particles travelling the ring
        # between docked modules, in each line's colour.
        seam_objs = [parts[2] for parts, _, _, _, _ in modules]
        ring_samples = 72

        def ring_points(_frame):
            return [
                Vector(ring_point((i / (ring_samples - 1)) * math.tau * 0.999))
                for i in range(ring_samples)
            ]

        trackers = {"ring": ring_points}
        for i, spec in enumerate(MODULES):
            trackers[f"module{i}"] = (
                lambda _f, o=seam_objs[i]: evaluated_location(o)
            )

        export_positions(scene, cam, args.out, args.frames, trackers)

        # Which frame each module is docked and lit by, so the overlay knows
        # when a segment of the ring becomes active. Mirrors animate().
        import json as _json
        import os as _os

        span = 0.70 / len(MODULES)
        meta = {
            "ringDrawnBy": round(0.20, 4),
            "modules": [
                {
                    "name": m["name"],
                    "angle": m["angle"],
                    "colour": "#%02X%02X%02X"
                    % tuple(int(round(c * 255)) for c in m["colour"][:3]),
                    "litAt": round(0.20 + i * span + span * 0.82, 4),
                }
                for i, m in enumerate(MODULES)
            ],
        }
        with open(_os.path.join(args.out, "meta.json"), "w", encoding="utf-8") as fh:
            _json.dump(meta, fh, indent=1)

    render_frames(scene, args.out, contact=args.contact, frames=args.frames)


if __name__ == "__main__":
    main()
