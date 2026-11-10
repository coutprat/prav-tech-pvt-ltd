import type { SectorIcon as Icon } from "@/content/sectors";

/** 24px line icons for the sector cards. Stroke follows currentColor. */
const PATHS: Record<Icon, string> = {
  bank: "M3 9.5 12 4l9 5.5M5 10v8m4.5-8v8m5-8v8M19 10v8M3 20h18",
  factory: "M3 20V10l5 3V10l5 3V6h3v14M3 20h18M17 9h3v11M7 17h2m4 0h2",
  cart: "M3 4h2l2.2 11h10.6L20 8H6.4M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01",
  truck:
    "M2 6h11v10H2zM13 10h4l3 3v3h-7M6 19a1.6 1.6 0 1 0 0-.01M17 19a1.6 1.6 0 1 0 0-.01",
  bolt: "M13 2 5 13h6l-1 9 8-11h-6l1-9z",
  leaf: "M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7",
  cap: "M2 9l10-5 10 5-10 5L2 9zm4 2v5c3 2.5 9 2.5 12 0v-5M22 9v6",
  scale:
    "M12 3v18M7 21h10M4 7h16M7 7l-3 7a3 3 0 0 0 6 0L7 7zm10 0-3 7a3 3 0 0 0 6 0l-3-7z",
  crane: "M5 21V5h2v16M3 21h8M6 5l13 3H7M17 8v6M15.5 14h3v3h-3z",
  tower:
    "M12 9v12M8.5 21 12 9l3.5 12M9.6 16.5h4.8M8 5.5a6 6 0 0 0 0 7M16 5.5a6 6 0 0 1 0 7M12 9a1.2 1.2 0 1 0 0-.01",
  spark:
    "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
  bed: "M3 6v14M3 16h18v4M21 16v-4a3 3 0 0 0-3-3h-7v7M7 12.5a1.8 1.8 0 1 0 0-.01",
  cross: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  flask:
    "M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7.5 15h9",
  pillar: "M3 9 12 4l9 5H3zM5 9v9m3.5-9v9m7-9v9M19 9v9M12 9v9M3 21h18M4 18h16",
};

export function SectorIcon({ name, size = 22 }: { name: Icon; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
