"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChatCircleText, X, PaperPlaneRight, ArrowUpRight } from "@phosphor-icons/react";
import { site } from "@/content/site";

type Msg = { role: "user" | "assistant"; content: string; cites?: string[] };

const SUGGESTIONS = [
  "What does Praverse actually build?",
  "How do you keep a person in the loop?",
  "What is sovereign AI infrastructure?"
];

/** Pulls the trailing `CITE: /a, /b` line out of a reply. */
function splitCites(text: string): { body: string; cites: string[] } {
  const m = text.match(/\n?CITE:\s*([^\n]*)\s*$/);
  if (!m) return { body: text.trim(), cites: [] };
  const cites = m[1]
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("/"));
  return { body: text.slice(0, m.index).trim(), cites };
}

/**
 * The site assistant.
 *
 * Built to the same standard as everything it describes: it answers only from
 * the published site, it shows which page each answer came from, and when it
 * does not know it says so and hands over to a person. A bot that invented a
 * capability here would undercut the company's entire argument, so the
 * constraints live in the API route and this is the surface for them.
 *
 * It is deliberately a small panel, not a full-screen takeover: a visitor who
 * opens it should not lose the page they were reading, because the answer is
 * usually on that page.
 */
export function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and focus goes back where it came from.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view as it streams.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      setError("");
      setInput("");
      const next: Msg[] = [...msgs, { role: "user", content: question }];
      setMsgs(next);
      setBusy(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.slice(-12).map((m) => ({ role: m.role, content: m.content }))
          })
        });

        if (!res.ok || !res.body) {
          const j = (await res.json().catch(() => null)) as { error?: string } | null;
          setError(j?.error ?? "The assistant is unavailable just now.");
          setBusy(false);
          return;
        }

        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        setMsgs((m) => [...m, { role: "assistant", content: "" }]);

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          const { body } = splitCites(acc);
          setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: body };
            return copy;
          });
        }

        const { body, cites } = splitCites(acc);
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: body, cites };
          return copy;
        });
      } catch {
        setError(`Could not reach the assistant. Write to ${site.enquiryEmail} instead.`);
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs]
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div id="praverse-assistant">
      <button
        ref={launcherRef}
        type="button"
        className="as-launch"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="as-panel"
        aria-label={open ? "Close the site assistant" : "Ask the site assistant"}
      >
        {open ? (
          <X size={20} weight="bold" aria-hidden="true" />
        ) : (
          <ChatCircleText size={21} weight="duotone" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div className="as-panel" id="as-panel" ref={panelRef} role="dialog" aria-label="Site assistant">
          <div className="as-head">
            <div>
              <p className="as-title">Ask about this site</p>
              <p className="as-sub">
                Answers come only from these pages, with the page shown.
              </p>
            </div>
          </div>

          <div className="as-log" ref={logRef} aria-live="polite" aria-atomic="false">
            {msgs.length === 0 ? (
              <div className="as-empty">
                <p>
                  I can only tell you what is already published here — and I will
                  show you which page it came from. For anything commercial, or
                  anything specific to your situation, a person answers through{" "}
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    the contact form
                  </Link>
                  .
                </p>
                <ul className="as-suggest">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => void send(s)}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {msgs.map((m, i) => (
              <div className="as-msg" data-role={m.role} key={i}>
                <p>{m.content}</p>
                {m.cites?.length ? (
                  <ul className="as-cites">
                    {m.cites.map((c) => (
                      <li key={c}>
                        <Link href={c} onClick={() => setOpen(false)}>
                          {c}
                          <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            {busy && msgs[msgs.length - 1]?.role === "user" ? (
              <div className="as-msg" data-role="assistant">
                <p className="as-dots" aria-label="Thinking">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            ) : null}

            {error ? <p className="as-error">{error}</p> : null}
          </div>

          <form className="as-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="as-input">
              Your question
            </label>
            <input
              ref={inputRef}
              id="as-input"
              type="text"
              value={input}
              maxLength={600}
              placeholder="Ask a question…"
              autoComplete="off"
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
              <PaperPlaneRight size={16} weight="fill" aria-hidden="true" />
            </button>
          </form>

          <p className="as-foot">
            Generated from this site&rsquo;s own pages. It can be wrong — check
            the page it cites, and{" "}
            <Link href="/contact" onClick={() => setOpen(false)}>
              ask a person
            </Link>{" "}
            for anything that matters.
          </p>
        </div>
      ) : null}
    </div>
  );
}
