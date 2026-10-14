import { FilePdf, FilePpt, ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { downloads } from "@/content/downloads";

/**
 * The deck downloads.
 *
 * PDF leads and PPTX follows, deliberately. The PDF is a quarter of the size,
 * opens on any device without Office, and is the right answer for the person
 * who just wants to read it on a phone between meetings. The editable file is
 * there for whoever has to present it, which is a smaller and more patient
 * audience.
 *
 * Size and slide count are on the face of the link rather than hidden behind
 * it: an unlabelled download on a mobile connection is a small act of rudeness.
 * Both files are same-origin, so no download attribute gymnastics are needed —
 * the browser will do the sensible thing with each type.
 */
export function Downloads() {
  return (
    <ul className="dl-grid">
      {downloads.map((d) => (
        <li className="dl-card" key={d.title}>
          <div className="dl-head">
            <h3 className="h3" style={{ fontSize: 21 }}>
              {d.title}
            </h3>
            <span className="dl-meta mono">
              {d.pages} · {d.updated}
            </span>
          </div>

          <p className="body-2" style={{ marginTop: 12, fontSize: 15 }}>
            {d.body}
          </p>

          <div className="dl-actions">
            <a className="btn btn-primary dl-primary" href={d.pdf} download>
              <FilePdf size={17} weight="duotone" aria-hidden="true" />
              Download PDF
              <span className="dl-size">{d.pdfSize}</span>
            </a>
            <a className="dl-secondary" href={d.pptx} download>
              <FilePpt size={15} weight="duotone" aria-hidden="true" />
              PowerPoint
              <span className="dl-size">{d.pptxSize}</span>
              <ArrowDown size={11} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
