import type { ReactNode } from "react";

/**
 * Text-only proof strip. No partner logos — naming a partner in text is a
 * claim we can control; a logo implies endorsement we have not been granted.
 */
export function ProofBar({ items }: { items: ReactNode[] }) {
  return (
    <div className="proof-bar">
      <div className="wrap">
        <ul className="proof-list">
          {items.map((item, i) => (
            // Items are static per page and may be elements, so index is stable.
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
