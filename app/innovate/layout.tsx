import type { Metadata } from "next";
export const metadata: Metadata = { title: "Innovate - Submit an Idea" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
