"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { navigation } from "@/data/navigation";
import ThemeToggleSwitch from "@/components/ui/ThemeToggleSwitch";

export function Navbar() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    if (!nav) return;
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      if (y < 80) {
        nav.classList.remove("nav-hidden");
      } else if (y > lastY + 6) {
        nav.classList.add("nav-hidden");
        // close mobile menu when hiding
        document.getElementById("navLinks")?.classList.remove("open");
      } else if (y < lastY - 6) {
        nav.classList.remove("nav-hidden");
      }
      lastY = y;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <ThemeToggleSwitch />
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
