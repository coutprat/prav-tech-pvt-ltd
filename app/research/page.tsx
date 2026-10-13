import type { Metadata } from "next";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel, CTASection } from "@/components/ui/primitives";
import { Verify } from "@/components/ui/Verify";
import { exploratoryTracks, publications, trackRecord } from "@/content/company";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Peer-reviewed work in medical imaging, edge AI and simulation — plus the exploratory tracks we are still investigating."
};

export default function ResearchPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <SectionLabel accent="teal">Research</SectionLabel>
          <Headline as="h1" className="display">
            Published first, productised second.
          </Headline>
          <p className="lede" style={{ marginTop: 32 }}>
            The company started in a lab. The work below is what we put through
            peer review before we tried to sell anything built on it.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------- publications */}
      <section className="section-tight">
        <div className="wrap">
          <SectionLabel>Publications</SectionLabel>
          <ul className="pub-list">
            {publications.map((p) => (
              <li key={p.venue}>
                <span className="num">{p.year}</span>
                <span>{p.venue}</span>
                <span className="pub-link">
                  <Verify id="publications-count">Link to follow</Verify>
                </span>
              </li>
            ))}
          </ul>
          <p className="body-2" style={{ marginTop: 20, fontSize: 15 }}>
            DOIs and links are being collected — see the open items in the
            redesign overview.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- track record */}
      <section className="section section-alt">
        <div className="wrap">
          <SectionLabel>Track record</SectionLabel>
          <Headline onScroll>From screening models to a product.</Headline>

          <ol className="timeline">
            {trackRecord.map((t) => (
              <li key={t.title}>
                <span className="timeline-year num">{t.year}</span>
                <div className="timeline-card">
                  <h3 className="h3" style={{ fontSize: 21 }}>
                    {t.title}
                  </h3>
                  <p className="body-2" style={{ marginTop: 8, fontSize: 15 }}>
                    {t.body}
                  </p>
                  {t.title === "DME detection" ? (
                    <p className="body-2" style={{ marginTop: 8, fontSize: 15 }}>
                      <Verify id="dme-accuracy" />
                    </p>
                  ) : null}
                  {t.title === "Netra Sakhi" ? (
                    <p className="body-2" style={{ marginTop: 8, fontSize: 15 }}>
                      <Verify id="netra-sakhi-scopus" />
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------- exploratory tracks */}
      <section className="section">
        <div className="wrap">
          <SectionLabel>Exploratory research — not products</SectionLabel>
          <Headline onScroll>Open questions we are working on.</Headline>
          <p className="body-2" style={{ marginTop: 18 }}>
            None of this is for sale, on a roadmap, or dated. It is listed
            because it is honestly where some of our attention goes.
          </p>

          <div className="grid-4">
            {exploratoryTracks.map((t) => (
              <article className="card" key={t.title}>
                <h3 className="h3" style={{ fontSize: 19 }}>
                  {t.title}
                </h3>
                <p className="body-2" style={{ marginTop: 10, fontSize: 15 }}>
                  {t.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Working on something similar?"
        body="We collaborate with clinical and academic teams. Tell us what you are investigating."
        primary={{ href: "/contact", label: "Get in touch" }}
      />
    </>
  );
}
