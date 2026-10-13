/**
 * The parts list for "Inside an 800G module", kept in its own module.
 *
 * ModuleSection shows these six labels as plain text for low-power devices,
 * reduced motion, and before the 3D scene loads. Importing them from
 * ModuleExploded would statically pull three.js, @react-three/fiber, drei and
 * postprocessing into the page bundle — which silently defeated every lazy
 * path below it. Data belongs where both sides can read it without the
 * renderer.
 */
export type Part = {
  id: string;
  label: string;
  blurb: string;
  /** Where it flies to when exploded, relative to the assembled position. */
  offset: [number, number, number];
  /**
   * Where this part's label sits, relative to the part. Sides alternate so
   * six labels on a vertical stack fan out instead of collapsing into one
   * unreadable column.
   */
  labelAt: [number, number, number];
};

export const PARTS: Part[] = [
  {
    id: "housing",
    label: "Housing",
    blurb: "The metal shell. Grounds the module and holds everything in line.",
    offset: [0, 1.05, 0],
    labelAt: [3.05, 0.1, 0]
  },
  {
    id: "heatsink",
    label: "Heat sink",
    blurb: "Pulls heat out. At 800G a module runs hot enough that this sets the limit.",
    offset: [0, 1.95, 0],
    labelAt: [-3.05, 0.1, 0]
  },
  {
    id: "pcb",
    label: "PCB",
    blurb: "Carries the high-speed lanes from the electrical edge to the optics.",
    offset: [0, -0.1, 0],
    labelAt: [-3.15, 0.05, 0]
  },
  {
    id: "dsp",
    label: "DSP / retimer",
    blurb: "Cleans up the signal and re-times it, which is what buys the extra reach.",
    offset: [0, -0.95, 0],
    labelAt: [3.15, 0, 0]
  },
  {
    id: "laser",
    label: "Optical engine",
    blurb: "Lasers and detectors. Turns electrical lanes into light and back.",
    offset: [0, -1.85, 0],
    labelAt: [-3.25, 0, 0]
  },
  {
    id: "fibre",
    label: "Fibre",
    blurb: "Carries the light out of the module and across the hall.",
    offset: [0, -2.75, 0],
    labelAt: [3.25, -0.1, 0]
  }
];
