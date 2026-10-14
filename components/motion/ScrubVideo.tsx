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
 *
 * With `playUntilScroll`, the clip plays on its own until the reader scrolls,
 * then stops and hands the playhead over. A scrubbed shot sitting on frame one
 * is indistinguishable from a photograph that failed to load, which is exactly
 * how it read to the owner; a few seconds of motion says "this is film, and it
 * answers to you" before anyone has touched anything.
 */
export function ScrubVideo({
  src,
  srcMobile,
  poster,
  progressRef,
  className,
  alt,
  playUntilScroll = false
}: {
  src: string;
  srcMobile?: string;
  poster: string;
  /** 0..1 position within the clip. */
  progressRef: RefObject<number>;
  className?: string;
  alt: string;
  /** Loop the clip until the first scroll, then scrub as usual. */
  playUntilScroll?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let duration = 0;
    let lastSeek = -1;
    // Scrubbing is the resting state unless we have been asked to play first.
    let scrubbing = !playUntilScroll;

    const onMeta = () => {
      duration = video.duration || 0;
      setReady(true);
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    /** The reader has taken over: stop playing and follow the scroll. */
    const handOver = () => {
      if (scrubbing) return;
      scrubbing = true;
      video.loop = false;
      video.pause();
      window.removeEventListener("scroll", onScroll);
    };

    const onCanPlay = () => {
      if (scrubbing) return;
      video.loop = true;
      // Muted and playsInline, so this is permitted without a gesture. If a
      // browser refuses anyway, the poster is still a complete first frame —
      // nothing below depends on playback having happened.
      void video.play().catch(() => {});
    };

    // A plain `scroll` listener is useless here: pinning the section fires one
    // during load, so the clip handed over before it had played a second. The
    // handover has to mean "the reader moved the page", which is a distance,
    // not an event. Direct input still counts immediately — a wheel notch or a
    // drag is intent even before the page has travelled 8px.
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 8) handOver();
    };
    const intents = ["wheel", "touchmove", "keydown"] as const;

    if (playUntilScroll) {
      video.addEventListener("canplay", onCanPlay);
      if (video.readyState >= 3) onCanPlay();
      window.addEventListener("scroll", onScroll, { passive: true });
      for (const ev of intents) {
        window.addEventListener(ev, handOver, { once: true, passive: true });
      }
    }

    const tick = () => {
      // While it is playing itself, the playhead is not ours to write.
      if (scrubbing === false) return;
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
      video.removeEventListener("canplay", onCanPlay);
      window.removeEventListener("scroll", onScroll);
      for (const ev of intents) window.removeEventListener(ev, handOver);
    };
  }, [progressRef, playUntilScroll]);

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
