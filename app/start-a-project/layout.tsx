import type { Metadata } from "next";
export const metadata: Metadata = { title: "Start a Project — Praverse Tech" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
