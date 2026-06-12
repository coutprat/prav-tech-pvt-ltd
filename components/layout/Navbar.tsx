import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/data/navigation";

export function Navbar() {
  return (
    <nav id="nav">
      <Link href="/" className="logo">
        <Image src="/logo.svg" className="logo-mark" alt="Praverse" width={28} height={28} priority />
        Praverse
      </Link>
      <ul id="navLinks">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <button className="theme-toggle" title="Toggle Space Tour" type="button">
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
