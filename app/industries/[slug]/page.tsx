import type { Metadata } from "next";
import { brief } from "@/lib/answers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { howWeWork } from "@/content/company";
import { getSector, sectors } from "@/content/sectors";
import type { CSSProperties } from "react";
import { CtaBand, Faq, Figure, PageHero, Section, SectionHead } from "@/components/pv/kit";
import { BentoTile, bentoItems } from "@/components/pv/IndustriesBento";
import { SectorMotif } from "@/components/pv/SectorMotif";
import { Flow } from "@/components/pv/Flow";

export const dynamicParams = false;

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSector(slug);
  if (!s) return {};
  return pageMeta({
    title: s.seo.title,
    description: s.seo.description,
    path: `/industries/${s.slug}`,
    og: `industries-${s.slug}`,
  });
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getSector(slug);
  if (!s) notFound();
  const path = `/industries/${s.slug}`;
  const me = bentoItems.find((b) => b.id === s.slug);
  const colour = me?.colour ?? "var(--gold)";
  // Nearest neighbours in the bento order, then Government to close the row.
  const pool = bentoItems.filter((b) => !b.flagship && b.id !== s.slug);
  const at = Math.max(0, bentoItems.filter((b) => !b.flagship).findIndex((b) => b.id === s.slug));
  const near = [...pool.slice(at), ...pool.slice(0, at)].slice(0, 3);
  const gov = bentoItems.find((b) => b.id === "government");

  return (
    <>
      <PageJsonLd path={path} />
      <PageHero
        eyebrow={brief(`/industries/${s.slug}`).lead}
        title={
          <>
            {s.headline} <em>{s.em}</em>.
          </>
        }
        lede={s.lede}
        actions={
          <>
            <Link className="btn-p" href="/start-a-project">
              Start a project <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn-g" href="/industries">
              All industries
            </Link>
          </>
        }
        meta={s.lines.map((l) => l.label)}
        visual={
          <div className="sec-hero-art pv-glass" style={{ "--c": colour } as CSSProperties}>
            <SectorMotif icon={s.icon} id={`hero-${s.slug}`} />
          </div>
        }
      />

      {/* -------------------------------------------------------- services */}
      <Section>
        <SectionHead
          index="01"
          eyebrow="What we build"
          title={
            <>
              Services for <em>{s.name.toLowerCase()}</em>.
            </>
          }
        />
        <ol className="sec-svc">
          {s.services.map((x, i) => (
            <li key={x.title} className="pv-rise">
              <span className="sec-svc-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{x.title}</h3>
              <p>{x.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------------------------------------- use cases */}
      <Section tone="raised">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="02"
              eyebrow="Use cases"
              title="Where teams start."
            />
          </div>
          <div>
            <ul className="pv-list2">
              {s.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            <p className="pv-eyebrow" style={{ marginTop: 40 }}>
              Built with
            </p>
            <div className="pv-chips-row" style={{ marginTop: 14 }}>
              {s.systems.map((x) => (
                <span key={x} className="pv-chip">
                  {x}
                </span>
              ))}
            </div>
            {s.proof?.length ? (
              <ul className="pv-list2" style={{ marginTop: 32 }}>
                {s.proof.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ engagement */}
      <Section>
        <SectionHead
          index="03"
          eyebrow="How an engagement runs"
          title={
            <>
              From the problem to <em>production</em>.
            </>
          }
          lede="The same four steps in every sector. Each ends in something you can read, test or run."
        />
        <Figure
          n="01"
          title="An engagement, start to finish"
          caption="The written plan comes before production code, and the review gate is designed into the build rather than added at the end."
        >
          <Flow
            nodes={howWeWork.map((w, i) => ({
              k: `Step ${i + 1}`,
              title: w.step,
              body: w.body,
            }))}
          />
        </Figure>
        <p className="pv-body" style={{ marginTop: 32 }}>
          Draws on:{" "}
          {s.lines.map((l, i) => (
            <span key={l.href}>
              {i ? " · " : ""}
              <Link className="pv-link" href={l.href}>
                {l.label}
              </Link>
            </span>
          ))}
        </p>
      </Section>

      {/* ------------------------------------------------------------- FAQ */}
      <Section tone="raised">
        <div className="pv-split">
          <div className="pv-sticky">
            <SectionHead
              index="04"
              eyebrow="Questions"
              title={
                <>
                  Straight <em>answers</em>.
                </>
              }
            />
          </div>
          <Faq items={s.faq} />
        </div>
      </Section>

      {/* ---------------------------------------------------------- others */}
      <Section tight>
        <SectionHead eyebrow="Other sectors" title="Also built for." />
        <div className="sec-near">
          {near.map((b) => (
            <BentoTile key={b.id} b={b} n={bentoItems.filter((x) => !x.flagship).indexOf(b) + 1} />
          ))}
          {gov ? <BentoTile b={gov} /> : null}
        </div>
      </Section>

      <CtaBand
        title={
          <>
            Tell us the <em>workflow</em>.
          </>
        }
        body="Describe it in plain language. You get a written plan within two business days."
      />
    </>
  );
}
