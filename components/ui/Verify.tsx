import type { ReactNode } from "react";
import { getVerifyItem, type VerifyId } from "@/content/verify";

/**
 * Wraps a claim that nobody has confirmed yet.
 *
 * - production: renders the safe fallback text, or nothing at all when the
 *   fallback is empty (i.e. the claim is omitted until it is verified).
 * - development: same text, plus a yellow dashed outline and the id, so an
 *   unverified claim cannot quietly reach a review build.
 *
 * Every id must exist in content/verify.ts, which is also what the final
 * overview enumerates.
 */
export function Verify({
  id,
  children
}: {
  id: VerifyId;
  /** Override the rendered text. The registry still governs confirmed/fallback. */
  children?: ReactNode;
}) {
  const item = getVerifyItem(id);
  const isDev = process.env.NODE_ENV === "development";
  const text = item.confirmed ? item.claim : item.fallback;

  // No fallback and not confirmed → the claim is withheld entirely.
  if (!children && !text) {
    return isDev ? (
      <span className="verify" data-dev="true" data-verify-id={id}>
        [withheld: {id}]
      </span>
    ) : null;
  }

  return (
    <span
      className="verify"
      data-dev={isDev ? "true" : undefined}
      data-verify-id={isDev ? id : undefined}
    >
      {children ?? text}
    </span>
  );
}

/** True when a claim has no confirmed value and no fallback — caller should skip it. */
export function isWithheld(id: VerifyId): boolean {
  const item = getVerifyItem(id);
  return !item.confirmed && !item.fallback;
}
