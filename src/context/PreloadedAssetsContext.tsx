"use client";

import { createContext, useContext } from "react";

export interface PreloadedAssets {
  heroBackground: string | null;
  heroPhoto: string | null;
  profileImage: string | null;
}

const PreloadedAssetsContext = createContext<PreloadedAssets>({
  heroBackground: null,
  heroPhoto: null,
  profileImage: null,
});

export const PreloadedAssetsProvider = PreloadedAssetsContext.Provider;

export function usePreloadedAssets() {
  return useContext(PreloadedAssetsContext);
}
