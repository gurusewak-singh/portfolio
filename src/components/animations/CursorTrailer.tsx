"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/context/ThemeContext";

interface CursorTrailerProps {
  size?: number;
}

// Theme-aware cursor colors
const cursorColors = {
  light: {
    ring: "rgba(99, 102, 241, 0.6)",
    ringHover: "rgba(139, 92, 246, 0.8)",
    ringBg: "rgba(139, 92, 246, 0.15)",
    dot: "rgba(99, 102, 241, 0.9)",
    glow: "rgba(99, 102, 241, 0.6)",
  },
  dark: {
    ring: "rgba(129, 140, 248, 0.5)",
    ringHover: "rgba(167, 139, 250, 0.8)",
    ringBg: "rgba(167, 139, 250, 0.1)",
    dot: "rgba(255, 255, 255, 0.9)",
    glow: "rgba(129, 140, 248, 0.8)",
  },
};

export default function CursorTrailer({ size = 24 }: CursorTrailerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const colors = cursorColors[theme];

  // Use immediate values for accurate positioning
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Lighter spring for outer ring (follows with slight delay for nice effect)
  const springConfig = useMemo(
    () => ({ damping: 30, stiffness: 400, mass: 0.5 }),
    [],
  );
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const updateCursorPosition = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    setIsMounted(true);

    // Only show custom cursor on desktop with fine pointer
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("magnetic") ||
        target.closest('[data-cursor="pointer"]');

      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Use passive listeners for better performance
    window.addEventListener("mousemove", updateCursorPosition, {
      passive: true,
    });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [updateCursorPosition]);

  // Don't render on server or if not mounted
  if (!isMounted || !isVisible) return null;

  // Use portal to render cursor directly to body, bypassing any CSS transforms
  const cursorContent = (
    <>
      {/* Outer ring - follows with spring delay */}
      <motion.div
        style={{
          position: "fixed",
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
          pointerEvents: "none",
          zIndex: 99999,
        }}
        animate={{
          width: isHovering ? size * 2 : size,
          height: isHovering ? size * 2 : size,
          opacity: isClicking ? 0.5 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        aria-hidden="true"
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `2px solid ${isHovering ? colors.ringHover : colors.ring}`,
            background: isHovering ? colors.ringBg : "transparent",
          }}
          animate={{
            scale: isClicking ? 0.85 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
        />
      </motion.div>

      {/* Inner dot - tracks mouse position directly for accuracy */}
      <motion.div
        style={{
          position: "fixed",
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: colors.dot,
          boxShadow: `0 0 10px ${colors.glow}`,
          pointerEvents: "none",
          zIndex: 99999,
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        aria-hidden="true"
      />
    </>
  );

  // Render to document.body using portal to escape any CSS transform contexts
  return createPortal(cursorContent, document.body);
}
