'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  yOffset?: number;
  rotateAmount?: number;
  delay?: number;
}

export default function FloatingElement({
  children,
  className = '',
  duration = 6,
  yOffset = 20,
  rotateAmount = 5,
  delay = 0
}: FloatingElementProps) {
  return (
    <motion.div
      initial={{ y: 0, rotateZ: 0, rotateY: 0 }}
      animate={{
        y: [-yOffset / 2, yOffset / 2, -yOffset / 2],
        rotateZ: [-rotateAmount / 2, rotateAmount / 2, -rotateAmount / 2],
        rotateY: [-rotateAmount, rotateAmount, -rotateAmount]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

// Parallax floating orbs for backgrounds
interface FloatingOrbProps {
  className?: string;
  size?: number;
  color?: string;
  duration?: number;
  delay?: number;
  xRange?: number;
  yRange?: number;
}

export function FloatingOrb({
  className = '',
  size = 300,
  color = 'rgba(99, 102, 241, 0.3)',
  duration = 20,
  delay = 0,
  xRange = 50,
  yRange = 30
}: FloatingOrbProps) {
  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 1 }}
      animate={{
        x: [-xRange, xRange, -xRange],
        y: [-yRange, yRange, -yRange],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(40px)',
        position: 'absolute',
        pointerEvents: 'none'
      }}
    />
  );
}
