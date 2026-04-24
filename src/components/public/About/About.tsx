"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { usePreloadedAssets } from "@/context/PreloadedAssetsContext";
import styles from "./About.module.css";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SectionHeader from "@/components/public/SectionHeader";

// Profile Image with fallback - uses preloaded assets from context
function ProfileImage() {
  const { profileImage } = usePreloadedAssets();
  const [imageError, setImageError] = useState(false);

  if (imageError || !profileImage) {
    return (
      <div className={styles.profilePlaceholder}>
        <span className={styles.placeholderInitial}>G</span>
      </div>
    );
  }

  return (
    <Image
      src={profileImage}
      alt="Gurusewak - AI/ML Engineer"
      fill
      style={{ objectFit: "cover" }}
      priority
      sizes="(max-width: 768px) 100vw, 350px"
      onError={() => setImageError(true)}
      unoptimized={profileImage.startsWith("data:")}
    />
  );
}

// Animated counter hook
function useAnimatedCounter(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || !isInView || hasStarted.current) return;
    hasStarted.current = true;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView, startOnView]);

  return { count, ref };
}

export default function About() {
  const stat1 = useAnimatedCounter(1, 1500);
  const stat2 = useAnimatedCounter(5, 2000);
  const stat3 = useAnimatedCounter(3, 1800);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <SectionHeader number="01" label="About" title="Who I am" />

        <div className={styles.content}>
          <div className={styles.text}>
            {[
              <>
                Hi, I’m Guru, an <span className={styles.highlight}>AI/ML Engineer</span> focused on building production-ready intelligent systems and scalable backend applications. I work on machine learning models, Large Language Model (LLM) applications, and high-performance APIs designed for real-world use.
              </>,
              <>
                My experience includes developing Retrieval-Augmented Generation (RAG) systems, deploying models on GPU infrastructure, and building backend services using FastAPI and PostgreSQL. I focus on creating efficient, reliable systems that perform well in production environments.
              </>,
              <>
                I approach engineering with strong fundamentals in machine learning, system design, and backend development. My goal is to build practical AI systems that are scalable, maintainable, and impactful.
              </>,
              <>
                Outside of development, I actively explore research, experiment with new architectures, and work on projects that deepen my expertise in artificial intelligence and software engineering.
              </>,
            ].map((paragraph, index) => (
              <ScrollReveal
                key={index}
                variant="fadeLeft"
                delay={0.1 + index * 0.15}
              >
                <motion.p
                  className={styles.paragraph}
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {paragraph}
                </motion.p>
              </ScrollReveal>
            ))}
          </div>

          <div className={styles.imageSection}>
            <ScrollReveal variant="fadeRight" delay={0.3}>
              <motion.div
                className={styles.imageContainer}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Profile Photo */}
                <div className={styles.profileImage}>
                  <ProfileImage />
                </div>
                <motion.div
                  className={styles.imageFrame}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                />
              </motion.div>
            </ScrollReveal>

            <div className={styles.stats}>
              {[
                { value: stat1, suffix: "", label: "Years Experience" },
                { value: stat2, suffix: "+", label: "Projects Completed" },
                { value: stat3, suffix: "+", label: "ML Models Deployed" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className={styles.statItem}
                  initial={{ opacity: 0, y: 30, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                  }}
                  style={{ perspective: 800 }}
                  ref={stat.value.ref}
                >
                  <motion.span
                    className={styles.statNumber}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.7 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {stat.value.count}
                    {stat.suffix}
                  </motion.span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
