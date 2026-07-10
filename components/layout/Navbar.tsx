"use client";

import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/data/navigation";
import { useSpaceTour } from "@/components/space-tour/SpaceTourProvider";

export function Navbar() {
  const { open } = useSpaceTour();

  return (
    <nav id="nav">
      <Link href="/" className="logo">
        <Image src="/logo.svg" className="logo-mark" alt="PraverseTech" width={28} height={28} priority />
        PraverseTech
      </Link>
      <ul id="navLinks">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <button className="space-tour-trigger" title="Launch Space Tour" type="button" onClick={open}>
        <span className="orb-ic" />
        <span className="tt-label">SPACE TOUR</span>
      </button>
      <Link href="/contact" className="btn btn-primary">
        Start a Project
      </Link>
      <button id="menuBtn" aria-label="Menu" type="button">
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
