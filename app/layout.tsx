import type { Metadata } from "next";
import { Assistant } from "@/components/sections/Assistant";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { themeScript } from "@/components/layout/theme";
import { company } from "@/content/company";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "Praverse Tech — Intelligence, engineered for industry.",
    template: "%s · Praverse Tech"
  },
  description: company.oneLiner,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: company.url,
    siteName: company.name,
    title: "Praverse Tech — Intelligence, engineered for industry.",
    description: company.oneLiner
  },
  twitter: {
    card: "summary",
    title: "Praverse Tech — Intelligence, engineered for industry.",
    description: company.oneLiner
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Sets the theme before first paint so dark loads don't flash light. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <OrganizationJsonLd />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <Assistant />
        <WhatsAppButton />
        <SmoothScroll />
        {/*
          Cookieless Core Web Vitals from real visitors. Sets no cookies and
          builds no cross-site profile, so it needs no consent banner — the
          privacy page says exactly this.

          Only rendered on Vercel: its script is served from /_vercel/..., which
          exists nowhere else, so including it locally or on any other host just
          puts a 404 in everyone's console.
        */}
        {/*
          Both are gated on VERCEL so local and preview builds do not report,
          and so a self-hosted copy of this site ships with no measurement at
          all. Both are cookieless — see /privacy, which describes exactly
          this and has to stay true.
        */}
        {process.env.VERCEL ? <SpeedInsights /> : null}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
