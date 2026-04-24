"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import styles from "./SplineHero.module.css";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => null,
});

const SCENE_URL =
  "https://prod.spline.design/uyjjdqlPYik3EmHd/scene.splinecode";

export default function SplineHero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.stage} aria-hidden="true">
      <div
        className={styles.skeleton}
        style={{ opacity: loaded ? 0 : 1 }}
      />
      <Suspense fallback={null}>
        <div
          className={styles.sceneWrap}
          style={{ opacity: loaded ? 1 : 0 }}
        >
          <Spline scene={SCENE_URL} onLoad={() => setLoaded(true)} />
        </div>
      </Suspense>
      <div className={styles.vignette} />
    </div>
  );
}
