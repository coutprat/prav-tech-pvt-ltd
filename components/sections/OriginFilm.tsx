"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useHighPower } from "@/lib/capability";
import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { signatureVideo } from "@/content/media";

/**
 * The desk the company started on, behind the origin story.
 *
 * Held much further back than the signature films: this section is prose that
 * has to be read, so the footage is atmosphere and nothing more. It drifts with
 * the scroll rather than being scrubbed frame-accurately, and the scrim is
 * heavy enough that body copy keeps its contrast over the brightest frame.
 *
 * Absent entirely on low-power devices and under reduced motion — the story
 * reads the same without it.
 */
export function OriginFilm() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const highPower = useHighPower();
  const [ready, setReady] = useState(false);
  const film = signatureVideo.company;

  useEffect(() => {
    if (highPower !== true) return;
    const arm = () => setReady(true);
    window.addEventListener("scroll", arm, { once: true, passive: true });
    window.addEventListener("touchstart", arm, { once: true, passive: true });
    return () => {
      window.removeEventListener("scroll", arm);
      window.removeEventListener("touchstart", arm);
    };
  }, [highPower]);

  useGSAP(
    () => {
      if (!highPower || !ready || prefersReducedMotion()) return;
      const st = gsap.to(
        { v: 0 },
        {
          v: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              progress.current = self.progress;
            }
          }
        }
      );
      return () => {
        st.scrollTrigger?.kill();
        st.kill();
      };
    },
    { scope: root, dependencies: [highPower, ready] }
  );

  if (highPower !== true || !ready || !film) return null;

  return (
    <div className="origin-film" ref={root} aria-hidden="true">
      <ScrubVideo
        className="origin-film-video"
        src={film.src}
        srcMobile={film.srcMobile}
        poster={film.poster}
        progressRef={progress}
        alt={film.alt}
      />
      <span className="origin-film-scrim" />
    </div>
  );
}
