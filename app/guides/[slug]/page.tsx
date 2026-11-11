import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { brief } from "@/lib/answers";
import { guides, getGuide } from "@/content/guides";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { CtaBand, Faq, PageHero, Rows, Section, SectionHead } from "@/components/pv/kit";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return pageMeta({ title: g.title, description: g.description, path: `/guides/${g.slug}` });
}

const nn = (i: number) => String(i + 1).padStart(2, "0");

/** A buyer's guide: the direct answer first, then how to choose, then FAQs. */
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;

  return (
    <>
      <PageJsonLd path={path} />
      <PageHero
        accent="white"
        eyebrow={brief(path).lead}
        title={g.h1}
        lede={g.answer}
        meta={[`Updated ${new Date(g.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, "Praverse Tech, Vadodara"]}
      />
      {g.sections.map((s, i) => (
        <Section key={s.heading} tone={i % 2 ? "raised" : undefined}>
          <SectionHead index={nn(i)} eyebrow={g.lead} title={s.heading} />
          {s.body.map((p) => (
            <p key={p.slice(0, 40)} className="pv-lede">
              {p}
            </p>
          ))}
          {s.points ? <Rows items={s.points.map((pt, j) => ({ k: nn(j), title: pt.title, body: pt.body }))} /> : null}
        </Section>
      ))}
      <Section>
        <SectionHead eyebrow="Questions" title="Asked by buyers" />
        <Faq items={g.faq} />
        <p className="pv-lede">
          More: <Link href="/enterprise-ai">AI &amp; ML development</Link> · <Link href="/pharma">Pharma &amp; regulatory AI</Link> ·{" "}
          <Link href="/government">Government AI</Link> · <Link href="/guides">All guides</Link>
        </p>
      </Section>
      <CtaBand title="Start with a pilot on your own data." body="Tell us the workflow. You get a written plan within two business days." />
    </>
  );
}
