"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A video whose playhead is driven by scroll instead of time.
 *
 * Works because the file is encoded with a very short GOP (one keyframe every
 * 6 frames — see scripts/media/cinematic.sh). With a normal ~2s keyframe
 * interval every seek has to decode a long run of P-frames, which is what
 * makes scrubbed video feel like treacle.
 *
 * Seeking happens on gsap.ticker, the same loop as ScrollTrigger and Lenis,
 * and only when the target has actually moved — a redundant `currentTime`
 * write still costs a seek.
 */
export function ScrubVideo({
  src,
  srcMobile,
  poster,
  progressRef,
  className,
  alt
}: {
  src: string;
  srcMobile?: string;
  poster: string;
  /** 0..1 position within the clip. */
  progressRef: RefObject<number>;
  className?: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let duration = 0;
    let lastSeek = -1;

    const onMeta = () => {
      duration = video.duration || 0;
      setReady(true);
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    const tick = () => {
      if (!duration) return;
      const p = Math.max(0, Math.min(1, progressRef.current ?? 0));
      const t = p * (duration - 0.05);
      // A seek is expensive even when it lands on the same frame.
      if (Math.abs(t - lastSeek) < 1 / 48) return;
      lastSeek = t;
      try {
        video.currentTime = t;
      } catch {
        /* seeking before the clip is ready; the next tick retries */
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [progressRef]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-label={alt}
      data-ready={ready}
    >
      {srcMobile ? <source src={srcMobile} type="video/mp4" media="(max-width: 899px)" /> : null}
      <source src={src} type="video/mp4" />
    </video>
  );
}
