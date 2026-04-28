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

// Cap device pixel ratio — retina runs fragment shaders at DPR^2 cost.
const MAX_DPR = 1.25;

// Pre-play the scene 1500px before it enters viewport so the WebGL render
// loop is already warm by the time the user scrolls to the hero. Stop only
// when the hero is well off-screen (50px) so a quick scroll-up doesn't
// thrash play/stop. This asymmetry is what makes the return scroll smooth.
const PLAY_ROOT_MARGIN = "1500px 0px";
const STOP_ROOT_MARGIN = "50px 0px";

// Double-rAF: defer the play() call by two animation frames so it never
// runs inside the same tick as the scroll handler that triggered it.
function deferToIdleFrame(fn: () => void) {
  if (typeof requestAnimationFrame === "undefined") {
    fn();
    return;
  }
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

export default function SplineHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const playObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        const app = appRef.current;
        if (!app || !visible) return;
        if (app.isStopped) {
          deferToIdleFrame(() => {
            if (appRef.current?.isStopped) appRef.current.play();
          });
        }
      },
      { rootMargin: PLAY_ROOT_MARGIN, threshold: 0 },
    );

    const stopObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        const app = appRef.current;
        if (!app || visible) return;
        if (!app.isStopped) {
          deferToIdleFrame(() => {
            if (appRef.current && !appRef.current.isStopped) {
              appRef.current.stop();
            }
          });
        }
      },
      { rootMargin: STOP_ROOT_MARGIN, threshold: 0 },
    );

    playObserver.observe(el);
    stopObserver.observe(el);

    return () => {
      playObserver.disconnect();
      stopObserver.disconnect();
    };
  }, []);

  const handleLoad = (app: Application) => {
    appRef.current = app;
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
