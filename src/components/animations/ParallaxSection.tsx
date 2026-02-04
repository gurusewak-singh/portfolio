'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up'
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * multiplier]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax background layer
interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  rotateOnScroll?: boolean;
}

export function ParallaxLayer({
  children,
  className = '',
  speed = 0.3,
  rotateOnScroll = false
}: ParallaxLayerProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'].map(v => `calc(${v} * ${speed})`));
  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotateOnScroll ? 15 : 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div ref={ref} className={className} style={{ position: 'relative' }}>
      <motion.div
        style={{ y, rotate, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// 3D perspective scroll effect
interface Scroll3DProps {
  children: ReactNode;
  className?: string;
}

export function Scroll3D({ children, className = '' }: Scroll3DProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        opacity,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
