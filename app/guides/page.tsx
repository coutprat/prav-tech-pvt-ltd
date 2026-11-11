import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { brief } from "@/lib/answers";
import { guides } from "@/content/guides";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { CtaBand, PageHero, Rows, Section } from "@/components/pv/kit";

export const metadata: Metadata = pageMeta({
  title: "Buyer's Guides to Choosing an AI Development Company",
  description:
    "Plain guides to choosing a company to build AI software, and an AI partner for pharma quality and regulatory work, from Praverse Tech, Vadodara.",
  path: "/guides"
});

export default function GuidesIndex() {
  return (
    <>
      <PageJsonLd path="/guides" />
      <PageHero
        accent="white"
        eyebrow={brief("/guides").lead}
        title="How to choose who builds your AI"
        lede="What to ask, what each kind of provider is for, and where Praverse Tech fits and where it does not."
      />
      <Section>
        <Rows
          items={guides.map((g, i) => ({
            k: String(i + 1).padStart(2, "0"),
            title: <Link href={`/guides/${g.slug}`}>{g.h1}</Link>,
            body: g.description
          }))}
        />
      </Section>
      <CtaBand title="Know what you want built?" body="Tell us the workflow. You get a written plan within two business days." />
    </>
  );
}
