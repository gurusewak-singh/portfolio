'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = ''
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100
  });
  
  const displayValue = useMotionValue('0');

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      displayValue.set(Math.floor(latest).toString());
    });
    return unsubscribe;
  }, [springValue, displayValue]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}

// Progress bar with scroll animation
interface AnimatedProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  duration?: number;
}

export function AnimatedProgress({
  value,
  className = '',
  barClassName = '',
  duration = 1
}: AnimatedProgressProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={className}>
      <motion.div
        className={barClassName}
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: `${value}%`, opacity: 1 } : {}}
        transition={{ 
          duration, 
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.2 }
        }}
      />
    </div>
  );
}
