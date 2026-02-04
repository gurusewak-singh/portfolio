"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, MeshWobbleMaterial, Trail } from "@react-three/drei";
import {
  useRef,
  Suspense,
  useState,
  useMemo,
  memo,
  useEffect,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useTheme } from "@/context/ThemeContext";

// Theme colors for 3D elements
const theme3DColors = {
  light: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    tertiary: "#a855f7",
    sparkle: "#8b5cf6",
    ambient: 0.5,
    sparkleOpacity: 0.35,
  },
  dark: {
    primary: "#818cf8",
    secondary: "#a78bfa",
    tertiary: "#c084fc",
    sparkle: "#c084fc",
    ambient: 0.3,
    sparkleOpacity: 0.4,
  },
};

// ============================================
// PERFORMANCE UTILITIES
// ============================================

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

// ============================================
// INTERACTIVE 3D BLOB
// ============================================

const InteractiveBlob = memo(function InteractiveBlob({
  color = "#818cf8",
}: {
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(1);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;

      // Floating motion
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.6) * 0.2;

      // Smooth scale on hover
      targetScale.current = hovered ? 1.15 : 1;
      const currentScale = meshRef.current.scale.x;
      const newScale =
        currentScale + (targetScale.current - currentScale) * 0.1;
      meshRef.current.scale.setScalar(newScale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[1.3, 2]} />
        <MeshWobbleMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          factor={hovered ? 0.3 : 0.15}
          speed={hovered ? 3 : 1.5}
        />
      </mesh>
    </Float>
  );
});

// ============================================
// NEURAL NETWORK 3D VISUALIZATION
// ============================================

const NeuralNode = memo(function NeuralNode({
  position,
  delay = 0,
}: {
  position: [number, number, number];
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state) => {
    if (meshRef.current && visible) {
      // Subtle pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial
        color="#c084fc"
        emissive="#818cf8"
        emissiveIntensity={0.4}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
});

const NeuralConnection = memo(function NeuralConnection({
  start,
  end,
  delay = 0,
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay?: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(0.3), delay * 50);
    return () => clearTimeout(timer);
  }, [delay]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([...start, ...end]);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: "#a78bfa",
      transparent: true,
      opacity,
    });
  }, [opacity]);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.material = material;
    }
  }, [material]);

  return (
    <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />
  );
});

const NeuralNetwork3D = memo(function NeuralNetwork3D() {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-compute network structure
  const { nodes, connections } = useMemo(() => {
    const nodeList: {
      pos: [number, number, number];
      layer: number;
      index: number;
    }[] = [];
    const connList: {
      start: [number, number, number];
      end: [number, number, number];
      delay: number;
    }[] = [];

    const layers = [3, 5, 5, 3];
    const layerSpacing = 1.2;
    const nodeSpacing = 0.5;

    let totalIndex = 0;

    layers.forEach((count, layerIndex) => {
      const layerHeight = (count - 1) * nodeSpacing;

      for (let i = 0; i < count; i++) {
        const x = (layerIndex - 1.5) * layerSpacing;
        const y = (i - (count - 1) / 2) * nodeSpacing;
        const pos: [number, number, number] = [x, y, 0];

        nodeList.push({ pos, layer: layerIndex, index: totalIndex });

        // Connect to previous layer
        if (layerIndex > 0) {
          const prevLayerNodes = nodeList.filter(
            (n) => n.layer === layerIndex - 1,
          );
          prevLayerNodes.forEach((prevNode, pi) => {
            connList.push({
              start: prevNode.pos,
              end: pos,
              delay: totalIndex + pi,
            });
          });
        }

        totalIndex++;
      }
    });

    return { nodes: nodeList, connections: connList };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connections first (behind nodes) */}
      {connections.map((conn, i) => (
        <NeuralConnection
          key={`conn-${i}`}
          start={conn.start}
          end={conn.end}
          delay={conn.delay}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <NeuralNode key={`node-${i}`} position={node.pos} delay={node.index} />
      ))}
    </group>
  );
});

// ============================================
// FLOATING TECH ICONS (3D)
// ============================================

const FloatingIcon = memo(function FloatingIcon({
  position,
  shape = "cube",
  color = "#818cf8",
  size = 0.4,
}: {
  position: [number, number, number];
  shape?: "cube" | "octahedron" | "tetrahedron";
  color?: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "octahedron":
        return <octahedronGeometry args={[size, 0]} />;
      case "tetrahedron":
        return <tetrahedronGeometry args={[size, 0]} />;
      default:
        return <boxGeometry args={[size, size, size]} />;
    }
  }, [shape, size]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        {geometry}
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>
    </Float>
  );
});

// ============================================
// PROFILE SCENE
// ============================================

function ProfileSceneContent({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const colors = theme3DColors[theme];

  return (
    <>
      <FrameLimiter fps={30} />

      {/* Lighting */}
      <ambientLight intensity={colors.ambient} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={theme === "light" ? 1 : 0.8}
        color="#ffffff"
      />
      <pointLight
        position={[-5, -5, 5]}
        intensity={theme === "light" ? 0.3 : 0.4}
        color={colors.tertiary}
      />

      {/* Main interactive blob */}
      <InteractiveBlob color={colors.primary} />

      {/* Surrounding floating icons */}
      <FloatingIcon
        position={[2, 1, -1]}
        shape="octahedron"
        color={colors.secondary}
        size={0.25}
      />
      <FloatingIcon
        position={[-2, -0.5, -1]}
        shape="tetrahedron"
        color={colors.tertiary}
        size={0.2}
      />
      <FloatingIcon
        position={[1.5, -1.5, -0.5]}
        shape="cube"
        color={colors.tertiary}
        size={0.18}
      />

      {/* Particles */}
      <Sparkles
        count={40}
        scale={6}
        size={1.5}
        speed={0.3}
        color={colors.sparkle}
        opacity={colors.sparkleOpacity}
      />
    </>
  );
}

interface ProfileScene3DProps {
  className?: string;
}

export function ProfileScene3D({ className }: ProfileScene3DProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        width: "100%",
        height: "400px",
        cursor: "grab",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <ProfileSceneContent theme={theme} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

// ============================================
// ML SCENE
// ============================================

function MLSceneContent({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const colors = theme3DColors[theme];

  return (
    <>
      <FrameLimiter fps={30} />

      {/* Lighting */}
      <ambientLight intensity={colors.ambient} />
      <pointLight
        position={[5, 5, 5]}
        intensity={theme === "light" ? 1 : 0.8}
        color={colors.primary}
      />
      <pointLight
        position={[-5, -5, 5]}
        intensity={theme === "light" ? 0.3 : 0.4}
        color={colors.tertiary}
      />

      {/* Neural Network */}
      <NeuralNetwork3D />

      {/* Subtle particles */}
      <Sparkles
        count={30}
        scale={5}
        size={1}
        speed={0.2}
        color={colors.primary}
        opacity={colors.sparkleOpacity}
      />
    </>
  );
}

export function MLScene3D({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        width: "100%",
        height: "300px",
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
          <MLSceneContent theme={theme} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

export default ProfileScene3D;
