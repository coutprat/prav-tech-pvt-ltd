"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme";
import { useScrolled } from "@/lib/useMediaQuery";
import { navigation } from "@/data/navigation";

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);
  // The drawer remembers which route it was opened on, so a navigation closes
  // it by derivation rather than by an effect that fires after paint.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // The WhatsApp button watches this so it cannot sit on top of the menu.
    document.documentElement.setAttribute("data-nav-open", String(open));
    return () => {
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-nav-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="nav" data-scrolled={scrolled}>
      <nav className="wrap nav-inner" aria-label="Main">
        <Link className="nav-logo" href="/">
          Praverse<span className="dot">.</span>
        </Link>

        <ul className="nav-links">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <ThemeToggle />
          <Link className="btn btn-primary nav-cta" href="/start-a-project">
            Start a project
          </Link>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path
                  d="M5 5l14 14M19 5L5 19"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 7h18M3 17h18"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div className="nav-drawer" id="nav-drawer">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="btn btn-primary" href="/start-a-project">
            Start a project
          </Link>
        </div>
      ) : null}
    </header>
  );
}
