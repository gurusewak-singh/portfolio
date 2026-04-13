"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef, Suspense, useEffect, useState, memo } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// Monochrome color configuration — always black+white
const themeColors = {
  light: {
    crystal: "#ffffff",
    torusKnot: "rgba(255,255,255,0.6)",
    sphere: "rgba(255,255,255,0.4)",
    orbital: "rgba(255,255,255,0.5)",
    sparkles: "#ffffff",
    grid: "rgba(255,255,255,0.5)",
    ambient: 0.4,
    gridOpacity: 0.04,
    sparkleOpacity: 0.3,
  },
  dark: {
    crystal: "#ffffff",
    torusKnot: "rgba(255,255,255,0.6)",
    sphere: "rgba(255,255,255,0.4)",
    orbital: "rgba(255,255,255,0.5)",
    sparkles: "#ffffff",
    grid: "rgba(255,255,255,0.5)",
    ambient: 0.4,
    gridOpacity: 0.04,
    sparkleOpacity: 0.3,
  },
};

// ============================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================

// Limit frame rate for battery/performance
function FrameLimiter({ fps = 30 }: { fps?: number }) {
  const { invalidate, clock } = useThree();
  const lastTime = useRef(0);
  const interval = 1 / fps;

  useFrame(() => {
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastTime.current >= interval) {
      lastTime.current = elapsed;
      invalidate();
    }
  });

  return null;
}

// Adaptive performance based on device
function useAdaptivePerformance() {
  const [quality, setQuality] = useState<"high" | "medium" | "low">(() => {
    if (typeof window === "undefined") return "high";
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const cores = navigator.hardwareConcurrency || 4;
    if (isMobile || cores <= 2) return "low";
    if (cores <= 4) return "medium";
    return "high";
  });

  return quality;
}

// ============================================
// 3D COMPONENTS - OPTIMIZED
// ============================================

// Wireframe orbital rings
const OrbitalRings = memo(function OrbitalRings({
  position,
  color = "rgba(255,255,255,0.5)",
  size = 2,
}: {
  position: [number, number, number];
  color?: string;
  size?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size, 0.02, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[size * 0.8, 0.015, 8, 64]} />
        <meshBasicMaterial color="rgba(255,255,255,0.5)" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 2, 0]}>
        <torusGeometry args={[size * 0.6, 0.01, 8, 64]} />
        <meshBasicMaterial color="rgba(255,255,255,0.3)" transparent opacity={0.25} />
      </mesh>
    </group>
  );
});

// Grid floor with glow effect
const GridFloor = memo(function GridFloor({
  color = "rgba(255,255,255,0.5)",
  opacity = 0.04,
}: {
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={opacity}
      />
    </mesh>
  );
});

// ============================================
// MAIN SCENE COMPONENT
// ============================================

function HeroSceneContent({
  quality,
  theme,
}: {
  quality: "high" | "medium" | "low";
  theme: "light" | "dark";
}) {
  const colors = themeColors[theme];

  return (
    <>
      <FrameLimiter fps={quality === "low" ? 24 : 30} />

      {/* Lighting */}
      <ambientLight intensity={colors.ambient} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={theme === "light" ? 1 : 0.8}
        color="#ffffff"
      />

      {/* Grid floor */}
      <GridFloor color={colors.grid} opacity={colors.gridOpacity} />
    </>
  );
}

// Hero 3D Scene with single optimized Canvas
export function Hero3DScene() {
  const quality = useAdaptivePerformance();
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
    setMounted(true);
  }, []);

  if (!mounted || !hasWebGL) {
    return <FallbackBackground theme={theme} />;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, quality === "high" ? 2 : 1.5]}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <HeroSceneContent quality={quality} theme={theme} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Fallback for no WebGL
function FallbackBackground({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const colors = {
    primary: "rgba(255, 255, 255, 0.06)",
    secondary: "rgba(255, 255, 255, 0.03)",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          width: 200,
          height: 200,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

// ============================================
// ABOUT SECTION 3D SCENE
// ============================================

function AboutSceneContent({
  quality,
}: {
  quality: "high" | "medium" | "low";
}) {
  return (
    <>
      <FrameLimiter fps={24} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
            flatShading
          />
        </mesh>
      </Float>

      <OrbitalRings position={[0, 0, 0]} color="rgba(255,255,255,0.5)" size={2.5} />

      {quality !== "low" && (
        <Sparkles
          count={30}
          scale={8}
          size={1.5}
          speed={0.2}
          color="#ffffff"
          opacity={0.25}
        />
      )}
    </>
  );
}

export function About3DScene() {
  const quality = useAdaptivePerformance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "50%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.6,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <AboutSceneContent quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ============================================
// SKILLS SECTION 3D ELEMENT
// ============================================

function SkillsSceneContent() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <>
      <FrameLimiter fps={24} />
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.6} color="#ffffff" />

      <group ref={groupRef}>
        {/* Interlocking torus rings */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.2, 0.08, 16, 48]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.06, 16, 48]} />
          <meshStandardMaterial
            color="rgba(255,255,255,0.7)"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.8, 0.05, 16, 48]} />
          <meshStandardMaterial
            color="rgba(255,255,255,0.5)"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Center sphere */}
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </>
  );
}

export function Skills3DElement() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        height: "300px",
        pointerEvents: "none",
        opacity: 0.3,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <SkillsSceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Hero3DScene;
