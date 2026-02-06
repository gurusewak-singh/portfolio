"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Sparkles,
  useTexture,
  MeshWobbleMaterial,
} from "@react-three/drei";
import {
  useRef,
  useMemo,
  Suspense,
  useEffect,
  useState,
  memo,
  useCallback,
} from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// Theme color configurations
const themeColors = {
  light: {
    crystal: "#6366f1",
    torusKnot: "#8b5cf6",
    sphere: "#a855f7",
    orbital: "#6366f1",
    sparkles: "#8b5cf6",
    grid: "#6366f1",
    ambient: 0.6,
    gridOpacity: 0.05,
    sparkleOpacity: 0.4,
  },
  dark: {
    crystal: "#818cf8",
    torusKnot: "#a78bfa",
    sphere: "#c084fc",
    orbital: "#818cf8",
    sparkles: "#a78bfa",
    grid: "#818cf8",
    ambient: 0.4,
    gridOpacity: 0.08,
    sparkleOpacity: 0.5,
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
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const cores = navigator.hardwareConcurrency || 4;

    if (isMobile || cores <= 2) {
      setQuality("low");
    } else if (cores <= 4) {
      setQuality("medium");
    } else {
      setQuality("high");
    }
  }, []);

  return quality;
}

// ============================================
// 3D COMPONENTS - OPTIMIZED
// ============================================

// Floating crystal/gem shape - low poly but beautiful
const FloatingCrystal = memo(function FloatingCrystal({
  position,
  color = "#818cf8",
  size = 1,
  rotationSpeed = 1,
}: {
  position: [number, number, number];
  color?: string;
  size?: number;
  rotationSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        state.clock.elapsedTime * 0.3 * rotationSpeed;
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={size}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
});

// Animated torus knot - visually impressive, optimized
const AnimatedTorusKnot = memo(function AnimatedTorusKnot({
  position,
  color = "#a78bfa",
  size = 0.8,
}: {
  position: [number, number, number];
  color?: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={size}>
        <torusKnotGeometry args={[0.6, 0.2, 64, 8, 2, 3]} />
        <MeshWobbleMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          factor={0.1}
          speed={2}
        />
      </mesh>
    </Float>
  );
});

// Morphing sphere with noise
const MorphingSphere = memo(function MorphingSphere({
  position,
  color = "#c084fc",
  size = 1.2,
}: {
  position: [number, number, number];
  color?: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      meshRef.current.scale.setScalar(size * scale);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          flatShading
        />
      </mesh>
    </Float>
  );
});

// Wireframe orbital rings
const OrbitalRings = memo(function OrbitalRings({
  position,
  color = "#818cf8",
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
        <meshBasicMaterial color="#c084fc" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 2, 0]}>
        <torusGeometry args={[size * 0.6, 0.01, 8, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.3} />
      </mesh>
    </group>
  );
});

// Grid floor with glow effect
const GridFloor = memo(function GridFloor({
  color = "#818cf8",
  opacity = 0.08,
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
  const particleCount =
    quality === "high" ? 100 : quality === "medium" ? 50 : 25;
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
    setMounted(true);
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
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
  const colors =
    theme === "light"
      ? {
          primary: "rgba(124, 124, 248, 0.2)",
          secondary: "rgba(124, 124, 248, 0.15)",
        }
      : {
          primary: "rgba(124, 124, 248, 0.3)",
          secondary: "rgba(124, 124, 248, 0.2)",
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
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#a78bfa" />

      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#c084fc"
            metalness={0.8}
            roughness={0.2}
            flatShading
          />
        </mesh>
      </Float>

      <OrbitalRings position={[0, 0, 0]} color="#818cf8" size={2.5} />

      {quality !== "low" && (
        <Sparkles
          count={30}
          scale={8}
          size={1.5}
          speed={0.2}
          color="#a78bfa"
          opacity={0.4}
        />
      )}
    </>
  );
}

export function About3DScene() {
  const quality = useAdaptivePerformance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#818cf8" />

      <group ref={groupRef}>
        {/* Interlocking torus rings */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.2, 0.08, 16, 48]} />
          <meshStandardMaterial
            color="#818cf8"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.06, 16, 48]} />
          <meshStandardMaterial
            color="#a78bfa"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.8, 0.05, 16, 48]} />
          <meshStandardMaterial
            color="#c084fc"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Center sphere */}
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color="#e879f9"
            metalness={0.8}
            roughness={0.2}
            emissive="#818cf8"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </>
  );
}

export function Skills3DElement() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
