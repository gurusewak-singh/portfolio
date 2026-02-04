"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// Theme colors for loading screen
const loadingColors = {
  light: {
    primary: "rgba(99, 102, 241, 0.8)",
    secondary: "rgba(139, 92, 246, 0.4)",
    glow1: "rgba(99, 102, 241, 0.3)",
    glow2: "rgba(139, 92, 246, 0.15)",
    ring: "rgba(139, 92, 246, 0.25)",
    ringTop: "rgba(99, 102, 241, 0.7)",
    ringRight: "rgba(99, 102, 241, 0.4)",
    bg: "rgba(248, 250, 252, 0.97)",
    text: "#0f172a",
    subtext: "#475569",
    progress: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
    progressBg: "rgba(99, 102, 241, 0.15)",
  },
  dark: {
    primary: "rgba(129, 140, 248, 0.8)",
    secondary: "rgba(167, 139, 250, 0.4)",
    glow1: "rgba(129, 140, 248, 0.4)",
    glow2: "rgba(167, 139, 250, 0.2)",
    ring: "rgba(167, 139, 250, 0.3)",
    ringTop: "rgba(129, 140, 248, 0.8)",
    ringRight: "rgba(129, 140, 248, 0.5)",
    bg: "rgba(10, 10, 15, 0.97)",
    text: "#f9fafb",
    subtext: "#d1d5db",
    progress: "linear-gradient(90deg, #818cf8 0%, #a78bfa 100%)",
    progressBg: "rgba(129, 140, 248, 0.2)",
  },
};

// Animated glowing orb (CSS-only)
function GlowingOrb({
  size = 120,
  delay = 0,
  theme = "dark",
}: {
  size?: number;
  delay?: number;
  theme?: "light" | "dark";
}) {
  const colors = loadingColors[theme];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${colors.primary}, ${colors.secondary} 50%, transparent 70%)`,
        boxShadow: `
          0 0 60px ${colors.glow1},
          0 0 100px ${colors.glow2},
          inset 0 0 40px rgba(255, 255, 255, 0.1)
        `,
        filter: "blur(0.5px)",
      }}
    />
  );
}

// Orbiting ring (CSS animation)
function OrbitingRing({
  radius = 80,
  duration = 4,
  reverse = false,
  theme = "dark",
}: {
  radius?: number;
  duration?: number;
  reverse?: boolean;
  theme?: "light" | "dark";
}) {
  const colors = loadingColors[theme];

  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute",
        width: radius * 2,
        height: radius * 2,
        border: `1px solid ${colors.ring}`,
        borderRadius: "50%",
        borderTopColor: colors.ringTop,
        borderRightColor: colors.ringRight,
      }}
    />
  );
}

// Loading animation component (CSS-only, no Three.js)
interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen3D({ onLoadingComplete }: LoadingScreenProps) {
  const { theme } = useTheme();
  const colors = loadingColors[theme];
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  const loadingSteps = [
    { text: "Loading assets...", progress: 25 },
    { text: "Preparing experience...", progress: 50 },
    { text: "Almost ready...", progress: 75 },
    { text: "Welcome!", progress: 100 },
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep].text);
        setProgress(loadingSteps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onLoadingComplete, 300);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  const bgGradient =
    theme === "light"
      ? "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)"
      : "linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a24 100%)";

  const particleColor = theme === "light" ? "#6366f1" : "#818cf8";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: bgGradient,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: theme === "light" ? [0.15, 0.5, 0.15] : [0.1, 0.4, 0.1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              left: `${10 + i * 4}%`,
              top: `${20 + i * 3}%`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: particleColor,
              boxShadow: `0 0 10px ${particleColor}`,
            }}
          />
        ))}
      </div>

      {/* Central animated element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "3rem",
        }}
      >
        {/* Orbiting rings */}
        <OrbitingRing radius={90} duration={6} theme={theme} />
        <OrbitingRing radius={70} duration={4} reverse theme={theme} />
        <OrbitingRing radius={50} duration={3} theme={theme} />

        {/* Central orb */}
        <GlowingOrb size={80} theme={theme} />
      </motion.div>

      {/* Loading UI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: colors.text,
        }}
      >
        <motion.h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            background:
              theme === "light"
                ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)"
                : "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "1.5rem",
            letterSpacing: "0.1em",
          }}
        >
          GURU
        </motion.h1>

        <motion.p
          style={{
            fontSize: "0.9rem",
            color: colors.subtext,
            marginBottom: "1.5rem",
            fontFamily: "JetBrains Mono, Monaco, Consolas, monospace",
            minHeight: "1.4em",
          }}
          key={loadingText}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loadingText}
        </motion.p>

        {/* Progress bar */}
        <div
          style={{
            width: "180px",
            height: "3px",
            background: colors.progressBg,
            borderRadius: "2px",
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: colors.progress,
              borderRadius: "2px",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>

        <motion.span
          style={{
            display: "block",
            marginTop: "0.75rem",
            fontSize: "0.75rem",
            color: "#6b7280",
            fontFamily: "JetBrains Mono, Monaco, Consolas, monospace",
          }}
        >
          {progress}%
        </motion.span>
      </motion.div>

      {/* Animated dots */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#818cf8",
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Wrapper component with loading state
export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip rendering on server
  if (!mounted) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen3D onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default LoadingScreen3D;
