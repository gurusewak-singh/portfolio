"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import HeroBackground from "@/components/public/HeroBackground";
import MagneticButton from "@/components/animations/MagneticButton";
import ScrollReveal from "@/components/animations/ScrollReveal";

const roles = ["ML Engineer", "AI Enthusiast", "Problem Solver"];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  // Typing only runs when the hero is in view. Avoids React reconciles
  // every 50-100ms while user is reading other sections, which costs
  // frame budget during scroll-back.
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setIsVisible(entries[0]?.isIntersecting ?? false),
      { rootMargin: "100px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const currentText = roles[currentRole];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole, isVisible]);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <HeroBackground />

      <div className={styles.container}>
        <ScrollReveal variant="fadeUp" delay={0.2} className={styles.content}>
          <motion.p
            className={styles.greeting}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            className={styles.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.4,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            Gurusewak
          </motion.h1>

          <motion.div
            className={styles.roleWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className={styles.role}>
              {displayText}
              <motion.span
                className={styles.cursor}
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                |
              </motion.span>
            </span>
          </motion.div>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Building real-world AI systems that scale. Specialized in Generative
            AI, ML pipelines, and applied engineering. From models to
            production, I ship intelligent systems.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <MagneticButton strength={0.25}>
              <motion.a
                href="#projects"
                className={styles.primaryBtn}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
                }}
                whileTap={{ scale: 0.96 }}
              >
                View My Work
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </motion.a>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <motion.a
                href="#contact"
                className={styles.secondaryBtn}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Get In Touch
              </motion.a>
            </MagneticButton>
          </motion.div>

          <div className={styles.socialDivider} aria-hidden="true" />

          <motion.div
            className={styles.social}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {[
              {
                href: "https://github.com/gurusewak-singh",
                label: "GitHub",
                path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
              },
              {
                href: "https://linkedin.com/in/gurusewak122",
                label: "LinkedIn",
                path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
              },
              {
                href: "https://twitter.com/iamguruuu",
                label: "Twitter",
                path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
              },
            ].map((social, index) => (
              <MagneticButton key={social.label} strength={0.3}>
                <motion.a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.label}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.08 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.path} />
                  </svg>
                </motion.a>
              </MagneticButton>
            ))}
          </motion.div>
        </ScrollReveal>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          className={styles.mouse}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className={styles.wheel}
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll Down
        </motion.span>
      </motion.div>
    </section>
  );
}
