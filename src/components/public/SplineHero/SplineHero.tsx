"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import styles from "./SplineHero.module.css";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

// Self-hosted from /public so the file is served from your own CDN with
// long cache lifetimes — no CORS, no third-party network round-trip.
const SCENE_URL = "/scene.splinecode";

export default function SplineHero() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

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
            className={styles.sceneWrap}
            style={{ opacity: loaded ? 1 : 0 }}
          >
            {/* renderOnDemand is true by default — Spline only renders
                frames when the scene state actually changes (mouse input,
                scripted animation tick, etc). Manually pausing or
                rescaling the canvas while in flight does more harm than
                good; trust the runtime. */}
            <Spline
              scene={SCENE_URL}
              onLoad={() => setLoaded(true)}
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
