"use client";

/**
 * One network fetch per track file, shared by everything that reads it.
 *
 * The home hero draws two overlays over the same sequence — the ring and the
 * module labels — and each fetched the same positions.json independently.
 * They need different shapes out of it (the ring wants flattened polylines,
 * the labels want the resolution and point tracks only), so they cannot share
 * a parsed result; but they can share the request. That file is 144 KB on
 * desktop, and it was being pulled twice during the busiest part of the load.
 *
 * Keyed by URL, so the light and dark sets stay separate.
 */
const cache = new Map<string, Promise<unknown | null>>();

export function fetchTracks(url: string): Promise<unknown | null> {
  const hit = cache.get(url);
  if (hit) return hit;

  const p = fetch(url)
    .then((r) => (r.ok ? (r.json() as Promise<unknown>) : null))
    .catch(() => {
      // Drop the failure so a later mount can retry, rather than caching a
      // null forever and silently disabling the overlay for the session.
      cache.delete(url);
      return null;
    });

  cache.set(url, p);
  return p;
}
