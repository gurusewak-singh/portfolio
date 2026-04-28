"use client";

import { motion } from "framer-motion";
import RevealText from "@/components/animations/RevealText";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  number,
  label,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <motion.div
        className={styles.eyebrow}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      >
        <span className={styles.eyebrowNumber}>{number}</span>
        <motion.span
          className={styles.eyebrowLine}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        />
        <span>{label}</span>
      </motion.div>

      <RevealText as="h2" className={styles.title} text={title} />

      {subtitle && (
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
