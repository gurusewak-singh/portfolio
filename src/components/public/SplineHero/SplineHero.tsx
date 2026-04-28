"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import styles from "./SplineHero.module.css";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

const SCENE_URL =
  "https://prod.spline.design/uyjjdqlPYik3EmHd/scene.splinecode";

// DPR strategy:
// - When the hero is in (or near) view, render at the user's DPR capped at
//   1.25. Anything above 1.25 is invisible to most eyes but quadratic in
//   fragment-shader cost.
// - When the hero is far off-screen, drop DPR to 0.5 so the canvas keeps
//   running its render loop (preserves scene state, mouse interactivity,
//   no resume jitter on scroll-back) but does ~10x less GPU work per
//   frame — at 0.5 DPR the canvas renders quarter-resolution.
// - We toggle to high DPR 1500px BEFORE the hero enters viewport, so the
//   user never sees a low-res frame.
const DPR_HIGH = 1.25;
const DPR_LOW = 0.5;
const PROXIMITY_ROOT_MARGIN = "1500px 0px";

interface RendererInternals {
  setPixelRatio?: (n: number) => void;
}
interface AppInternals {
  _renderer?: RendererInternals;
}

export default function SplineHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Apply a target DPR to Spline's internal Three.js renderer. Calling
  // setPixelRatio resizes the WebGL drawing buffer and drops fragment
  // workload accordingly. Re-runs setSize so the resize takes effect on
  // the next frame.
  const setQuality = (highQuality: boolean) => {
    const app = appRef.current;
    const stage = containerRef.current;
    if (!app) return;
    try {
      const renderer = (app as unknown as AppInternals)._renderer;
      if (renderer?.setPixelRatio) {
        const target = highQuality
          ? Math.min(window.devicePixelRatio || 1, DPR_HIGH)
          : DPR_LOW;
        renderer.setPixelRatio(target);
      }
      if (stage && typeof app.setSize === "function") {
        app.setSize(stage.clientWidth, stage.clientHeight);
      }
    } catch {
      /* best effort — Spline internals may shift, fall back silently */
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Single observer with the wide proximity margin. Inside margin = high
    // quality. Outside = low quality. No stop()/play() — render loop runs
    // continuously, so there's no resume cost when scrolling back.
    const io = new IntersectionObserver(
      (entries) => {
        const near = entries[0]?.isIntersecting ?? true;
        setQuality(near);
      },
      { rootMargin: PROXIMITY_ROOT_MARGIN, threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleLoad = (app: Application) => {
    appRef.current = app;
    // Apply initial high-DPR setting (capped).
    setQuality(true);
    setLoaded(true);
  };

  return (
    <div ref={containerRef} className={styles.stage}>
      <div
        className={styles.skeleton}
        style={{ opacity: loaded && !failed ? 0 : 1 }}
        aria-hidden="true"
      />
      {!failed && (
        <Suspense fallback={null}>
          <div
            className={styles.sceneWrap}
            style={{ opacity: loaded ? 1 : 0 }}
          >
            <Spline
              scene={SCENE_URL}
              onLoad={handleLoad}
              onError={(e) => {
                console.error("Spline scene failed to load", e);
                setFailed(true);
              }}
            />
          </div>
        </Suspense>
      )}
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  );
}
