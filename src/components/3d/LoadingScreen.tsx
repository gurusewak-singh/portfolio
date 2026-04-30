"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PreloadedAssetsProvider,
  PreloadedAssets,
} from "@/context/PreloadedAssetsContext";

interface LoadingScreenProps {
  progress: number;
}

/**
 * Branded loading intro — Syne wordmark + a thin progress bar that
 * fills smoothly. Always animates on a fixed ~800ms timeline so the
 * intro feels deliberate, not laggy. The page underneath has already
 * rendered; the intro is just an overlay that fades out at the end.
 */
function LoadingScreen3D({ progress }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 700,
          margin: 0,
          fontFamily: "Syne, -apple-system, sans-serif",
          letterSpacing: "-0.03em",
        }}
      >
        <span style={{ color: "#ffffff" }}>Gurusewak</span>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>.in</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          marginTop: "2rem",
          width: "120px",
          height: "2px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "1px",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "1px",
            width: `${progress}%`,
          }}
          transition={{ duration: 0.05, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Loading wrapper.
 *
 * Asset preload (profile image) happens in the BACKGROUND from the
 * moment the wrapper mounts. The intro screen runs on its OWN fixed
 * timeline (~800ms ease-out animation, then 200ms exit fade) so the
 * branded intro is consistent regardless of whether MongoDB Atlas
 * is cold or warm. This is the difference between the old version
 * (which blocked up to 5s waiting on Mongo) and this one.
 *
 * Children render INSIDE the wrapper from the start. By the time
 * the loading overlay fades out, the page underneath is already
 * fully painted. Profile image either arrives during the intro
 * (typical case, since the API has a Cache-Control of 5min on
 * profile_image), or it arrives a beat later and the About skeleton
 * smoothly swaps in.
 */
const INTRO_DURATION_MS = 800;
const INTRO_EXIT_MS = 200;

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState<PreloadedAssets>({
    heroBackground: null,
    heroPhoto: null,
    profileImage: null,
  });

  useEffect(() => {
    let cancelled = false;

    // Background preload of the only asset the public site actually
    // uses (profile image). Cached at the edge so this is usually
    // a sub-100ms fetch; even on a cold cache it does not block.
    fetch("/api/settings?key=profile_image", { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.value) {
          setAssets((a) => ({ ...a, profileImage: data.value as string }));
        }
      })
      .catch(() => {
        /* fall through silently — components handle null state */
      });

    // Intro timeline — pure visual, doesn't wait on anything.
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / INTRO_DURATION_MS, 1);
      // ease-out-quad
      const eased = 1 - Math.pow(1 - t, 2);
      if (!cancelled) setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Tiny pause at 100% so the bar is briefly seen full,
        // then fade the overlay out.
        setTimeout(() => {
          if (!cancelled) setIsLoading(false);
        }, 120);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <PreloadedAssetsProvider value={assets}>
      <AnimatePresence>
        {isLoading && <LoadingScreen3D key="loading" progress={progress} />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{
          duration: INTRO_EXIT_MS / 1000,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </PreloadedAssetsProvider>
  );
}

export { LoadingScreen3D };
export default LoadingScreen3D;
