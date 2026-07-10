import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { SpaceTourProvider } from "@/components/space-tour/SpaceTourProvider";
import { ThreeGlobalBridge } from "@/components/three/ThreeGlobalBridge";
import { WebGLBackground } from "@/components/three/WebGLBackground";
import { site } from "@/data/site";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-d",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-b",
  display: "swap"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-m",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Praverse Tech — Enterprise AI/ML Systems for Real-World Industries",
    template: "%s"
  },
  description: site.description,
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Praverse Tech — Enterprise AI/ML Systems for Real-World Industries",
    description: site.description,
    images: ["/favicon.svg"]
  },
  twitter: {
    card: "summary",
    title: "Praverse Tech — Enterprise AI/ML Systems for Real-World Industries",
    description: site.description,
    images: ["/favicon.svg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <SpaceTourProvider>
          <Navbar />
          <ThreeGlobalBridge />
          <WebGLBackground />
          {children}
          <Footer />
          <SmoothScrollProvider />
        </SpaceTourProvider>
      </body>
    </html>
  );
}
