"use client";
import { usePathname } from "next/navigation";
import SatelliteParallax from "@/components/ui/SatelliteParallax";

const HIDDEN_ON = ["/contact"];

export default function SatelliteGuard() {
  const path = usePathname();
  if (HIDDEN_ON.includes(path)) return null;
  return <SatelliteParallax />;
}
