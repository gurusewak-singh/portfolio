"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroBackground.module.css";

/**
 * Premium monochrome hero background.
 * Pure CSS aurora blobs + grid + cursor spotlight + grain.
 * No WebGL, no third-party deps. Smooth at 60fps everywhere because
 * every animated property is transform/opacity.
 */
export default function HeroBackground() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [spotActive, setSpotActive] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const spotlight = spotlightRef.current;
    if (!stage || !spotlight) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      spotlight.style.setProperty("--spot-x", `${pendingX}px`);
      spotlight.style.setProperty("--spot-y", `${pendingY}px`);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only react when cursor is over the hero
      if (y < 0 || y > rect.height) return;
      pendingX = x;
      pendingY = y;
      if (!spotActive) setSpotActive(true);
      if (!queued) {
        queued = true;
        rafId = requestAnimationFrame(apply);
      }
    };

    const onPointerLeave = () => {
      setSpotActive(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [spotActive]);

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden="true">
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={styles.grid} />
      <div
        ref={spotlightRef}
        className={`${styles.spotlight} ${spotActive ? styles.active : ""}`}
      />
      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}
