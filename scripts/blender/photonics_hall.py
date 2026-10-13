"""
Photonics hero — "Light across the hall".

An empty pale data-hall floor. Rows of white/silver racks rise out of it.
Amber copper links light up inside each rack. Teal optical fibres then race
across the rows to the spine switches. The camera lifts to a top view of the
whole hall pulsing with light.

Chapters: "Copper inside the rack." / "Optics across the hall." / "400G → 800G → 1.6T."

Amber is the copper-link colour and appears on Photonics only; teal is the
optical layer. Geometry is generic data-hall massing, not any vendor's product.

Usage:
    blender -b -P scripts/blender/photonics_hall.py -- --out <dir> --res 1600x900 --frames 120
    blender -b -P scripts/blender/photonics_hall.py -- --out <dir> --contact
"""

import math
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import bpy  # noqa: E402
from _common import (  # noqa: E402
    AMBER, TEAL, evaluated_location, export_positions,
    add_camera, build_studio, ease_all, emission_input, key, key_socket,
    mat_aluminium, mat_ceramic, mat_seam,
    parse_args, render_frames, reset_scene, set_render, smooth,
)

ROWS = 4                 # rack rows
PER_ROW = 7              # racks per row
RACK_W, RACK_D, RACK_H = 0.62, 1.05, 2.05
ROW_GAP = 3.1            # aisle spacing between rows
RACK_GAP = 0.80          # spacing along a row

SPINE_X = 0.0            # spine switches sit at the hall's centre line


def rack_position(row, i):
    x = (i - (PER_ROW - 1) / 2) * (RACK_W + RACK_GAP)
    y = (row - (ROWS - 1) / 2) * ROW_GAP
    return x, y


def build_floor(dark=False):
    bpy.ops.mesh.primitive_plane_add(size=90, location=(0, 0, 0))
    floor = bpy.context.object
    floor.name = "HallFloor"
    floor_col = (0.032, 0.048, 0.092, 1.0) if dark else (0.845, 0.855, 0.875, 1.0)
    mat = mat_ceramic("HallFloorMat", floor_col)
    mat.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.28
    floor.data.materials.append(mat)
    return floor


def build_rack(row, i):
    """
    One rack: ceramic shell, brushed front rail, an amber copper-link strip
    inside and a teal optical port strip near the top.
    """
    x, y = rack_position(row, i)
    idx = f"{row}_{i}"

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x, y, RACK_H / 2))
    body = bpy.context.object
    body.name = f"Rack_{idx}"
    body.scale = (RACK_W, RACK_D, RACK_H)
    bev = body.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.018
    bev.segments = 4
    bev.limit_method = "ANGLE"
    bev.harden_normals = True
    body.data.materials.append(
        mat_ceramic(f"RackMat_{idx}", (0.90, 0.90, 0.89, 1.0))
    )
    smooth(body, angle=45)

    # brushed front rail
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x, y - RACK_D / 2 - 0.012, RACK_H / 2))
    rail = bpy.context.object
    rail.name = f"Rail_{idx}"
    rail.scale = (RACK_W * 0.94, 0.03, RACK_H * 0.96)
    rail.data.materials.append(mat_aluminium(f"RailMat_{idx}"))

    # amber copper links — a stack of short bars low in the rack
    copper_mats = []
    for k in range(3):
        z = RACK_H * (0.22 + k * 0.11)
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x, y - RACK_D / 2 - 0.03, z))
        bar = bpy.context.object
        bar.name = f"Copper_{idx}_{k}"
        bar.scale = (RACK_W * 0.70, 0.012, 0.035)
        m = mat_seam(f"CopperMat_{idx}_{k}", AMBER, strength=0.0, tint=0.95)
        bar.data.materials.append(m)
        copper_mats.append(m)

    # teal optical ports — a single strip high in the rack
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x, y - RACK_D / 2 - 0.03, RACK_H * 0.74))
    port = bpy.context.object
    port.name = f"Port_{idx}"
    port.scale = (RACK_W * 0.70, 0.012, 0.045)
    port_mat = mat_seam(f"PortMat_{idx}", TEAL, strength=0.0, tint=0.95)
    port.data.materials.append(port_mat)

    parts = [body, rail, port] + [
        bpy.data.objects[f"Copper_{idx}_{k}"] for k in range(3)
    ]
    return parts, copper_mats, port_mat


def build_spine():
    """Two taller spine switches on the centre line that the fibres run to."""
    spines = []
    mats = []
    for s, y in enumerate((-ROW_GAP * 0.5, ROW_GAP * 0.5)):
        x = (PER_ROW / 2 + 1.4) * (RACK_W + RACK_GAP)
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x, y, RACK_H * 0.62))
        sp = bpy.context.object
        sp.name = f"Spine_{s}"
        sp.scale = (RACK_W * 1.25, RACK_D * 1.15, RACK_H * 1.24)
        bev = sp.modifiers.new("Bevel", "BEVEL")
        bev.width = 0.02
        bev.segments = 4
        bev.limit_method = "ANGLE"
        sp.data.materials.append(mat_aluminium(f"SpineMat_{s}"))
        smooth(sp, angle=45)

        bpy.ops.mesh.primitive_cube_add(
            size=1.0, location=(x - RACK_W * 0.64, y, RACK_H * 0.9)
        )
        face = bpy.context.object
        face.name = f"SpineFace_{s}"
        face.scale = (0.012, RACK_D * 1.0, 0.09)
        m = mat_seam(f"SpineFaceMat_{s}", TEAL, strength=0.0, tint=0.95)
        face.data.materials.append(m)

        spines.append((sp, face))
        mats.append(m)
    return spines, mats


def build_fibres():
    """
    Teal fibre runs: one per row, from the far end of the row to the spine.
    Drawn on with bevel_factor_end so light appears to race across the hall.
    """
    fibres = []
    for row in range(ROWS):
        _, y = rack_position(row, 0)
        x_start = -(PER_ROW / 2) * (RACK_W + RACK_GAP)
        x_end = (PER_ROW / 2 + 1.0) * (RACK_W + RACK_GAP)
        z = RACK_H * 1.06

        curve = bpy.data.curves.new(f"FibreCurve_{row}", type="CURVE")
        curve.dimensions = "3D"
        curve.bevel_depth = 0.016
        curve.bevel_resolution = 4
        curve.use_fill_caps = True

        pts = 48
        spline = curve.splines.new("POLY")
        spline.points.add(pts - 1)
        for i in range(pts):
            t = i / (pts - 1)
            x = x_start + (x_end - x_start) * t
            # gentle catenary sag plus a lift toward the spine
            sag = math.sin(t * math.pi) * 0.10
            yy = y * (1.0 - t * 0.55)
            spline.points[i].co = (x, yy, z - sag + t * 0.16, 1.0)

        fib = bpy.data.objects.new(f"Fibre_{row}", curve)
        bpy.context.scene.collection.objects.link(fib)
        m = mat_seam(f"FibreMat_{row}", TEAL, strength=1.8, tint=0.95)
        fib.data.materials.append(m)
        fibres.append((fib, m))
    return fibres


def animate(scene, racks, copper_mats, port_mats, spines, spine_mats, fibres, cam, target, frames):
    """
    Timeline:
        0.00–0.22   empty floor; racks rise row by row
        0.22–0.45   amber copper links light inside each rack
        0.45–0.72   teal fibres race across the rows to the spine
        0.72–1.00   camera lifts to a top view, whole hall pulsing
    """
    f = frames

    # --- racks rise --------------------------------------------------------
    for r, (parts, _, _) in enumerate(racks):
        row = r // PER_ROW
        start = 0.02 + (row / max(1, ROWS)) * 0.16
        f0 = max(1, int(f * start))
        f1 = int(f * (start + 0.08))
        for obj in parts:
            down = (obj.location.x, obj.location.y, obj.location.z - RACK_H * 1.25)
            up = (obj.location.x, obj.location.y, obj.location.z)
            key(obj, "location", f0, down)
            key(obj, "location", f1, up)

    for sp, face in spines:
        for obj in (sp, face):
            down = (obj.location.x, obj.location.y, obj.location.z - RACK_H * 1.6)
            up = (obj.location.x, obj.location.y, obj.location.z)
            key(obj, "location", int(f * 0.14), down)
            key(obj, "location", int(f * 0.23), up)

    # --- copper links light ------------------------------------------------
    for r, (_, c_mats, _) in enumerate(racks):
        row = r // PER_ROW
        col = r % PER_ROW
        t = 0.24 + (row * PER_ROW + col) / (ROWS * PER_ROW) * 0.18
        f0 = int(f * t)
        f1 = int(f * (t + 0.05))
        for m in c_mats:
            s = emission_input(m)
            key_socket(s, max(1, f0 - 1), 0.0)
            key_socket(s, f1, 1.9)
            key_socket(s, f, 1.5)

    # --- optical ports + fibres -------------------------------------------
    for r, (_, _, p_mat) in enumerate(racks):
        t = 0.46 + (r / (ROWS * PER_ROW)) * 0.16
        s = emission_input(p_mat)
        key_socket(s, max(1, int(f * t) - 1), 0.0)
        key_socket(s, int(f * (t + 0.04)), 2.1)
        key_socket(s, f, 1.7)

    for row, (fib, _) in enumerate(fibres):
        t = 0.48 + row * 0.055
        fib.data.bevel_factor_end = 0.0
        fib.data.keyframe_insert("bevel_factor_end", frame=max(1, int(f * t)))
        fib.data.bevel_factor_end = 1.0
        fib.data.keyframe_insert("bevel_factor_end", frame=int(f * (t + 0.20)))

    for m in spine_mats:
        s = emission_input(m)
        key_socket(s, int(f * 0.60), 0.0)
        key_socket(s, int(f * 0.74), 2.3)
        key_socket(s, f, 1.9)

    # --- camera: low establishing shot lifting to a top view ---------------
    key(cam, "location", 1, (-9.2, -11.0, 1.35))
    key(cam, "location", int(f * 0.45), (-7.0, -9.6, 3.1))
    key(cam, "location", int(f * 0.72), (-3.4, -7.2, 8.0))
    key(cam, "location", f, (0.4, -2.6, 15.6))

    key(target, "location", 1, (0, 0, RACK_H * 0.5))
    key(target, "location", int(f * 0.72), (0, 0, RACK_H * 0.45))
    key(target, "location", f, (0, 0, 0.0))


def main():
    args = parse_args()
    width, height = (int(v) for v in args.res.lower().split("x"))

    scene = reset_scene()
    set_render(scene, width, height, args.frames, args.samples)
    build_studio(scene, ground=False, dark=args.dark)
    build_floor(dark=args.dark)

    racks = []
    copper_mats = []
    port_mats = []
    for row in range(ROWS):
        for i in range(PER_ROW):
            parts, c_mats, p_mat = build_rack(row, i)
            racks.append((parts, c_mats, p_mat))
            copper_mats.extend(c_mats)
            port_mats.append(p_mat)

    spines, spine_mats = build_spine()
    fibres = build_fibres()

    cam, target = add_camera(
        scene,
        location=(-9.2, -11.0, 1.35),
        look_at=(0, 0, RACK_H * 0.5),
        lens=38.0,
        fstop=4.0,
    )

    animate(
        scene, racks, copper_mats, port_mats, spines, spine_mats, fibres,
        cam, target, args.frames,
    )
    ease_all()

    if not args.contact:
        # Screen-space tracks for the live overlay: amber packets hop along
        # copper inside each rack, teal packets run the fibres across the hall.
        import json as _json
        import os as _os

        from mathutils import Vector as _V

        copper_objs = []
        port_objs = []
        for row in range(ROWS):
            for i in range(PER_ROW):
                idx = f"{row}_{i}"
                copper_objs.append(
                    (bpy.data.objects[f"Copper_{idx}_0"],
                     bpy.data.objects[f"Copper_{idx}_2"])
                )
                port_objs.append(bpy.data.objects[f"Port_{idx}"])

        fib_samples = 20

        def fibre_pts(row):
            def fn(_f):
                sp = bpy.data.objects[f"Fibre_{row}"].data.splines[0]
                n = len(sp.points)
                step = max(1, n // fib_samples)
                return [_V(sp.points[j].co[:3]) for j in range(0, n, step)]
            return fn

        trackers = {}
        for i, (a, b) in enumerate(copper_objs):
            trackers[f"cu{i}a"] = lambda _f, o=a: evaluated_location(o)
            trackers[f"cu{i}b"] = lambda _f, o=b: evaluated_location(o)
        for i, o in enumerate(port_objs):
            trackers[f"port{i}"] = lambda _f, oo=o: evaluated_location(oo)
        for row in range(ROWS):
            trackers[f"fibre{row}"] = fibre_pts(row)

        export_positions(scene, cam, args.out, args.frames, trackers)

        meta = {
            "rows": ROWS,
            "perRow": PER_ROW,
            "copperLitFrom": 0.24,
            "fibreDrawnFrom": 0.48,
            "amber": "#F59E0B",
            "teal": "#4BD6C4",
        }
        with open(_os.path.join(args.out, "meta.json"), "w", encoding="utf-8") as fh:
            _json.dump(meta, fh, indent=1)

    render_frames(scene, args.out, contact=args.contact, frames=args.frames)


if __name__ == "__main__":
    main()
