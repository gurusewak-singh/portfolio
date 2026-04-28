"use client";

import { createElement } from "react";
import { motion, Variants } from "framer-motion";

interface RevealTextProps {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  stagger?: number;
  delay?: number;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const wordVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function RevealText({
  text,
  as = "span",
  className,
  stagger = 0.04,
  delay = 0,
}: RevealTextProps) {
  const words = text.split(" ");

  const inner = (
    <motion.span
      style={{ display: "inline-block" }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      custom={stagger}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            paddingRight: "0.25em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            variants={wordVariants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );

  return createElement(as, { className }, inner);
}
