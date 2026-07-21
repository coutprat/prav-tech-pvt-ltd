import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact - Praverse Tech" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
