import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { themeScript } from "@/components/layout/theme";
import { company } from "@/content/company";

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
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <SmoothScroll />
      </body>
    </html>
  );
}
