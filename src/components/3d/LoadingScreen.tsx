"use client";

import { useEffect, useState } from "react";
import {
  PreloadedAssetsProvider,
  PreloadedAssets,
} from "@/context/PreloadedAssetsContext";

/**
 * Non-blocking asset wrapper.
 *
 * The previous version showed a full-screen loading overlay while it
 * waited for /api/settings to return base64-encoded image blobs from
 * MongoDB. That added 2-3s of perceived blank time before the user
 * could see anything, even though the only asset the public site
 * actually needs is the profile image (Hero is now pure CSS).
 *
 * The new flow renders children IMMEDIATELY and fetches the profile
 * image in the background. Components that need it read from the
 * PreloadedAssetsContext; if the value is still null when they render,
 * they show their own placeholder/skeleton until the value arrives.
 *
 * No spinner, no delay, no blocking.
 */
export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<PreloadedAssets>({
    heroBackground: null,
    heroPhoto: null,
    profileImage: null,
  });

  useEffect(() => {
    let cancelled = false;

    // Only fetch the assets that are actually used. Hero no longer
    // pulls hero_background / hero_photo from settings — those columns
    // are skipped here to save 2x round-trips.
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

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PreloadedAssetsProvider value={assets}>
      {children}
    </PreloadedAssetsProvider>
  );
}

/** Kept as a no-op export so existing imports don't break. */
export function LoadingScreen3D() {
  return null;
}

export default LoadingScreen3D;
