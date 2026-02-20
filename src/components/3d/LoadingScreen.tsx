"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PreloadedAssetsProvider,
  PreloadedAssets,
} from "@/context/PreloadedAssetsContext";

interface LoadingScreenProps {
  progress: number;
}

function LoadingScreen3D({ progress }: LoadingScreenProps) {
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

// Preload a single image, returns the src on success or null on failure
function preloadImage(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Wrapper component with loading state + real asset preloading
export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preloadedAssets, setPreloadedAssets] = useState<PreloadedAssets>({
    heroBackground: null,
    heroPhoto: null,
    profileImage: null,
  });

  const performPreload = useCallback(async () => {
    try {
      // Step 1: Fetch all image URLs from settings API (30% progress)
      setProgress(10);

      const settingsKeys = ["hero_background", "hero_photo", "profile_image"];
      const fetchPromises = settingsKeys.map((key) =>
        fetch(`/api/settings?key=${key}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      );

      const results = await Promise.all(fetchPromises);
      setProgress(30);

      const heroBackgroundUrl = results[0]?.value || null;
      const heroPhotoUrl = results[1]?.value || null;
      const profileImageUrl = results[2]?.value || null;

      // Step 2: Preload all images in parallel (30% -> 90%)
      const imagesToPreload: { key: keyof PreloadedAssets; url: string | null }[] = [
        { key: "heroBackground", url: heroBackgroundUrl },
        { key: "heroPhoto", url: heroPhotoUrl },
        { key: "profileImage", url: profileImageUrl },
      ];

      const validImages = imagesToPreload.filter((img) => img.url);
      const totalImages = validImages.length;
      let loadedCount = 0;

      const assets: PreloadedAssets = {
        heroBackground: heroBackgroundUrl,
        heroPhoto: heroPhotoUrl,
        profileImage: profileImageUrl,
      };

      if (totalImages > 0) {
        const imagePromises = validImages.map(async (img) => {
          // Only preload non-data URLs (data: URLs are already inline)
          if (img.url && !img.url.startsWith("data:")) {
            await preloadImage(img.url);
          }
          loadedCount++;
          setProgress(30 + Math.round((loadedCount / totalImages) * 60));
        });

        await Promise.all(imagePromises);
      } else {
        setProgress(90);
      }

      setPreloadedAssets(assets);
      setProgress(100);

      // Small delay for smooth transition
      await new Promise((resolve) => setTimeout(resolve, 400));
    } catch {
      // On error, still complete loading so site isn't stuck
      console.log("Asset preloading had issues, continuing anyway");
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (mounted) {
      performPreload();
    }
  }, [mounted, performPreload]);

  // Skip rendering on server
  if (!mounted) {
    return null;
  }

  return (
    <PreloadedAssetsProvider value={preloadedAssets}>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen3D progress={progress} />}
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

export { LoadingScreen3D };
export default LoadingScreen3D;
