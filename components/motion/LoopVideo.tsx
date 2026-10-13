"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useMediaQuery";

export type VideoSource = { webm?: string; mp4: string };

/**
 * Muted looping background video that pauses whenever it is off screen, so a
 * hero loop never burns battery below the fold.
 *
 * Reduced motion gets the poster only — no video is even fetched.
 */
export function LoopVideo({
  desktop,
  mobile,
  poster,
  alt,
  className
}: {
  desktop: VideoSource;
  mobile?: VideoSource;
  poster: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Reduced motion: the still only — no video is fetched at all.
  if (reduced) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={poster} alt={alt} />;
  }

  // Narrowest media query first — the browser takes the first source it matches.
  const sets: { src: VideoSource; media?: string }[] = mobile
    ? [{ src: mobile, media: "(max-width: 899px)" }, { src: desktop }]
    : [{ src: desktop }];

  type Source = { url: string; type: string; media?: string };

  const sources = sets.flatMap(({ src, media }) => {
    const out: Source[] = [];
    if (src.webm) out.push({ url: src.webm, type: "video/webm", media });
    out.push({ url: src.mp4, type: "video/mp4", media });
    return out;
  });

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-label={alt}
    >
      {sources.map((s) => (
        <source key={s.url} src={s.url} type={s.type} media={s.media} />
      ))}
    </video>
  );
}
