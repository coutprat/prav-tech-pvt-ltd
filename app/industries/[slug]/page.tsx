import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { howWeWork } from "@/content/company";
import { getSector, sectors } from "@/content/sectors";
import {
  Card,
  CtaBand,
  Faq,
  Figure,
  Grid,
  PageHero,
  Section,
  SectionHead,
} from "@/components/pv/kit";
import { Flow } from "@/components/pv/Flow";
import { SectorIcon } from "@/components/pv/SectorIcon";

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
  const others = sectors.filter((x) => x.slug !== s.slug).slice(0, 6);

  return (
    <>
      <PageJsonLd path={path} />
      <PageHero
        eyebrow={`Industries · ${s.name}`}
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
        <Grid cols={2}>
          {s.services.map((x, i) => (
            <Card
              key={x.title}
              n={String(i + 1).padStart(2, "0")}
              title={x.title}
            >
              <p>{x.body}</p>
            </Card>
          ))}
        </Grid>
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
        <ul className="sec-others">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/industries/${o.slug}`}>
                <SectorIcon name={o.icon} size={18} />
                <span>{o.name}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/government">
              <SectorIcon name="pillar" size={18} />
              <span>Government & public sector</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
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
