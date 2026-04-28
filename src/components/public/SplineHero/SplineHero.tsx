"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import styles from "./SplineHero.module.css";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

const SCENE_URL = "/scene.splinecode";

// Cap pixel ratio at scene load. Set ONCE; not toggled afterwards
// (toggling triggers setSize which reallocates the WebGL framebuffer
// and is expensive). On a retina screen this halves fragment-shader
// cost with no perceptible quality loss.
const MAX_DPR = 1.25;

interface RendererInternals {
  setPixelRatio?: (n: number) => void;
}
interface AppInternals {
  _renderer?: RendererInternals;
}

export default function SplineHero() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // While the user is actively scrolling, disable pointer events on the
  // canvas. Scrolling causes natural cursor-relative-to-page movement,
  // which fires pointermove on the canvas, which makes Spline re-render
  // the robot every frame DURING the scroll — a vicious overlap with
  // the scroll's own frame budget. Re-enable as soon as scroll stops.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let scrolling = false;

    const onScroll = () => {
      if (!scrolling) {
        scrolling = true;
        wrap.style.pointerEvents = "none";
      }
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrolling = false;
        wrap.style.pointerEvents = "auto";
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  const handleLoad = (app: Application) => {
    try {
      const renderer = (app as unknown as AppInternals)._renderer;
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
    <div className={styles.stage}>
      <div
        className={styles.skeleton}
        style={{ opacity: loaded && !failed ? 0 : 1 }}
        aria-hidden="true"
      />
      {!failed && (
        <Suspense fallback={null}>
          <div
            ref={wrapRef}
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
