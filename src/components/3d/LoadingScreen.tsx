"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PreloadedAssets,
  PreloadedAssetsProvider,
} from "@/context/PreloadedAssetsContext";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  progress: number;
}

export function LoadingScreen3D({
  onLoadingComplete,
  progress,
}: LoadingScreenProps) {
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(onLoadingComplete, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 700,
          margin: 0,
          fontFamily: "Inter, -apple-system, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        <span style={{ color: "#ffffff" }}>Gurusewak</span>
        <span style={{ color: "#7c7cf8" }}>.in</span>
      </motion.h1>

      {/* Simple loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          marginTop: "2rem",
          width: "120px",
          height: "4px",
          background: "rgba(124, 124, 248, 0.15)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "#7c7cf8",
            borderRadius: "2px",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}

// Helper: fetch a setting value from the API
async function fetchSetting(key: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/settings?key=${key}`);
    if (res.ok) {
      const data = await res.json();
      return data.value || null;
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

// Helper: preload an image into the browser cache
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    // data: URIs don't need preloading — they're inline
    if (src.startsWith("data:")) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Don't block on failure
    img.src = src;
  });
}

// Wrapper component with loading state and asset preloading
export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState<PreloadedAssets>({
    heroBackground: null,
    heroPhoto: null,
    profileImage: null,
  });

  const assetsReady = useRef(false);
  const timerReady = useRef(false);
  const bothReadyChecked = useRef(false);

  const checkBothReady = useCallback(() => {
    if (assetsReady.current && timerReady.current && !bothReadyChecked.current) {
      bothReadyChecked.current = true;
      setProgress(100);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Timer animation — drives progress bar from 0 to ~90% over 2 seconds
  useEffect(() => {
    if (!mounted) return;

    const duration = 2000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      // Cap at 90 until assets are also ready
      const timerProgress = Math.min((elapsed / duration) * 90, 90);

      if (!assetsReady.current) {
        setProgress(timerProgress);
      }

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        timerReady.current = true;
        checkBothReady();
      }
    };

    requestAnimationFrame(updateProgress);
  }, [mounted, checkBothReady]);

  // Asset preloading — runs in parallel with the timer
  useEffect(() => {
    if (!mounted) return;

    const preloadAll = async () => {
      // 1. Fetch all settings in parallel
      const [heroBackground, heroPhoto, profileImage] = await Promise.all([
        fetchSetting("hero_background"),
        fetchSetting("hero_photo"),
        fetchSetting("profile_image"),
      ]);

      // 2. Store values
      setAssets({ heroBackground, heroPhoto, profileImage });

      // 3. Preload actual image bytes into browser cache
      const imagesToPreload: Promise<void>[] = [];
      if (heroBackground) imagesToPreload.push(preloadImage(heroBackground));
      if (heroPhoto) imagesToPreload.push(preloadImage(heroPhoto));
      if (profileImage) imagesToPreload.push(preloadImage(profileImage));

      await Promise.all(imagesToPreload);

      // 4. Mark assets as ready
      assetsReady.current = true;
      checkBothReady();
    };

    preloadAll();
  }, [mounted, checkBothReady]);

  // Skip rendering on server
  if (!mounted) {
    return null;
  }

  return (
    <PreloadedAssetsProvider value={assets}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen3D
            onLoadingComplete={() => setIsLoading(false)}
            progress={progress}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </PreloadedAssetsProvider>
  );
}

export default LoadingScreen3D;
