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

// Cap device pixel ratio — retina screens run fragment shaders at DPR^2 cost.
const MAX_DPR = 1.25;

export default function SplineHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Pause Spline's render loop when scrolled out of view, resume when back in.
  // Keeps the scene mounted (preserves state, no re-download, no jitter on
  // return scroll) while still saving GPU when off-screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        const app = appRef.current;
        if (!app) return;
        if (visible) {
          if (app.isStopped) app.play();
        } else {
          if (!app.isStopped) app.stop();
        }
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleLoad = (app: Application) => {
    appRef.current = app;

    // Cap DPR by reaching into Spline's internal Three.js renderer.
    // Not a public API but stable; falls back gracefully if Spline changes
    // internals.
    try {
      const renderer = (
        app as unknown as {
          _renderer?: { setPixelRatio?: (n: number) => void };
        }
      )._renderer;
      if (renderer?.setPixelRatio) {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        renderer.setPixelRatio(dpr);
      }
    } catch {
      /* best effort */
    }

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
