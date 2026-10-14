"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/content/site";

/**
 * Runtime error boundary.
 *
 * Deliberately plain: this renders when something has already gone wrong, so
 * it depends on as little as possible — no scroll machinery, no GSAP, no
 * images, nothing that could itself be the thing that broke. Inline styles for
 * the same reason, in case the stylesheet is what failed.
 *
 * It says what actually happened and gives two ways forward. It does not show
 * the stack: a visitor cannot act on it, and an error message is an
 * information-disclosure surface. `digest` is included because that is the id
 * the platform logs under, so a visitor who reports it gives us something we
 * can actually search for.
 */
export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("page error", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "70svh",
        display: "grid",
        placeContent: "center",
        padding: "80px 24px",
        textAlign: "left",
        maxWidth: 640,
        margin: "0 auto"
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
          margin: 0
        }}
      >
        Something broke
      </p>

      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 44px)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          fontWeight: 500,
          margin: "16px 0 0",
          color: "var(--ink)"
        }}
      >
        This page failed to load.
      </h1>

      <p
        style={{
          margin: "18px 0 0",
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--ink-2)"
        }}
      >
        Not your fault, and nothing you did caused it. Try again — if it keeps
        happening, tell us and we will fix it.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
        <button className="btn btn-primary" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="btn btn-ghost" href="/">
          Go to the homepage
        </Link>
      </div>

      <p
        style={{
          margin: "28px 0 0",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--ink-2)"
        }}
      >
        Reporting it to{" "}
        <a className="link" href={`mailto:${site.enquiryEmail}`}>
          {site.enquiryEmail}
        </a>{" "}
        helps.
        {error.digest ? (
          <>
            {" "}
            Quote reference{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>{error.digest}</code>.
          </>
        ) : null}
      </p>
    </main>
  );
}
