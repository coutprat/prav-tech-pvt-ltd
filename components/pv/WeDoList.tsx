import type { WeDo } from "@/content/wedo";

/** "We build …" offers, one per row, with the record's status as a small tag. */
export function WeDoList({ items }: { items: readonly WeDo[] }) {
  return (
    <ul className="pv-offers">
      {items.map((o) => (
        <li key={o.title} className="pv-rise">
          <h3>
            <span className="pv-we">We build</span>
            {o.title}
          </h3>
          <div>
            <p>{o.body}</p>
            {o.backed ? <span className="pv-offer-tag">{o.backed}</span> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
