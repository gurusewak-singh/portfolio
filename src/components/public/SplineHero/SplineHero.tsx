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
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        setInView(visible);
        if (!visible) setLoaded(false);
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldRender = inView && !failed;

  const handleLoad = (app: Application) => {
    // Reach into the Spline runtime's internal renderer to cap DPR.
    // Not a public API, but stable across Spline runtime versions — the
    // runtime just wraps a Three.js WebGLRenderer exposed as `_renderer`.
    try {
      const renderer = (app as unknown as { _renderer?: { setPixelRatio?: (n: number) => void; getSize?: (t: { x: number; y: number }) => { x: number; y: number }; setSize?: (w: number, h: number, updateStyle?: boolean) => void } })._renderer;
      if (renderer?.setPixelRatio) {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        renderer.setPixelRatio(dpr);
      }
    } catch {
      /* best effort; if Spline changes internals, we just fall back to default */
    }
    setLoaded(true);
  };

  return (
    <div ref={containerRef} className={styles.stage} aria-hidden="true">
      <div
        className={styles.skeleton}
        style={{ opacity: loaded && shouldRender ? 0 : 1 }}
      />
      {shouldRender && (
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
      <div className={styles.vignette} />
    </div>
  );
}
