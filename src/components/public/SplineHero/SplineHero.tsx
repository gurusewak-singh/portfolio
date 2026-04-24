"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import styles from "./SplineHero.module.css";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

const SCENE_URL =
  "https://prod.spline.design/uyjjdqlPYik3EmHd/scene.splinecode";

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
              onLoad={() => setLoaded(true)}
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
