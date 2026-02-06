"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./About.module.css";
import ScrollReveal from "@/components/animations/ScrollReveal";

// Profile Image with fallback - fetches from settings API
function ProfileImage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/settings?key=profile_image");
        if (res.ok) {
          const data = await res.json();
          if (data.value) {
            setImageSrc(data.value);
          }
        }
      } catch {
        console.log("Using placeholder profile image");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileImage();
  }, []);

  // Show placeholder while loading or if no image/error
  if (isLoading) {
    return (
      <div className={styles.profilePlaceholder}>
        <span className={styles.placeholderInitial}>G</span>
      </div>
    );
  }

  if (imageError || !imageSrc) {
    return (
      <div className={styles.profilePlaceholder}>
        <span className={styles.placeholderInitial}>G</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt="Guru - ML Engineer & Full Stack Developer"
      fill
      style={{ objectFit: "cover" }}
      priority
      sizes="(max-width: 768px) 100vw, 350px"
      onError={() => setImageError(true)}
      unoptimized={imageSrc.startsWith("data:")}
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
  const stat1 = useAnimatedCounter(3, 1500);
  const stat2 = useAnimatedCounter(20, 2000);
  const stat3 = useAnimatedCounter(15, 1800);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <ScrollReveal variant="fadeUp">
          <div className={styles.header}>
            <motion.span
              className={styles.sectionNumber}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              01.
            </motion.span>
            <h2 className={styles.title}>About Me</h2>
            <motion.div
              className={styles.line}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </ScrollReveal>

        <div className={styles.content}>
          <div className={styles.text}>
            {[
              <>
                Hello! I&apos;m Guru, a passionate{" "}
                <span className={styles.highlight}>AI/ML Engineer</span> and{" "}
                <span className={styles.highlight}>Full Stack Developer</span>{" "}
                with a deep love for building intelligent systems and beautiful
                web applications.
              </>,
              <>
                My journey in tech started with a curiosity about how machines
                can learn and make decisions. This curiosity led me to dive deep
                into machine learning, deep learning, and artificial
                intelligence, while simultaneously building robust web
                applications to bring these models to life.
              </>,
              <>
                I believe in the power of combining cutting-edge AI with
                practical software engineering to create solutions that make a
                real difference. Whether it&apos;s developing predictive models,
                building scalable APIs, or crafting intuitive user interfaces, I
                approach every project with the same enthusiasm and attention to
                detail.
              </>,
              <>
                When I&apos;m not coding, you can find me exploring the latest
                research papers, contributing to open-source projects, or
                experimenting with new technologies.
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
                { value: stat1, suffix: "+", label: "Years Experience" },
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
                    scale: 1.1,
                    boxShadow: "0 20px 40px rgba(124, 124, 248, 0.2)",
                    borderColor: "var(--accent-primary)",
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
