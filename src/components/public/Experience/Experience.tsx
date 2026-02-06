"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Experience.module.css";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Experience {
  _id: string;
  company: string;
  position: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  current: boolean;
}

const placeholderExperience: Experience[] = [
  {
    _id: "1",
    company: "Tech Innovation Labs",
    position: "Senior ML Engineer",
    description:
      "Led the development of machine learning pipelines for predictive analytics. Designed and deployed deep learning models for natural language processing tasks. Collaborated with cross-functional teams to integrate ML solutions into production systems.",
    technologies: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "AWS SageMaker",
      "Docker",
    ],
    startDate: "2022-06-01",
    current: true,
  },
  {
    _id: "2",
    company: "DataDriven Solutions",
    position: "Full Stack Developer",
    description:
      "Built scalable web applications using modern JavaScript frameworks. Developed RESTful APIs and microservices architecture. Implemented CI/CD pipelines and automated testing frameworks.",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Kubernetes"],
    startDate: "2021-01-15",
    endDate: "2022-05-31",
    current: false,
  },
  {
    _id: "3",
    company: "StartUp Accelerator",
    position: "Junior Software Developer",
    description:
      "Contributed to the development of a SaaS platform for business analytics. Gained experience in agile methodologies and collaborative development. Participated in code reviews and technical documentation.",
    technologies: ["JavaScript", "Python", "MongoDB", "Git", "Jira"],
    startDate: "2020-03-01",
    endDate: "2020-12-31",
    current: false,
  },
];

function formatDate(dateStr: string | undefined, current: boolean): string {
  if (current) return "Present";
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>(
    placeholderExperience,
  );

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/experience");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setExperiences(data);
          }
        }
      } catch (error) {
        console.log("Using placeholder experiences");
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className={styles.experience}>
      <div className={styles.container}>
        <ScrollReveal variant="fadeUp">
          <div className={styles.header}>
            <motion.span
              className={styles.sectionNumber}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              03.
            </motion.span>
            <h2 className={styles.title}>Work Experience</h2>
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

        <div className={styles.timeline}>
          {/* Animated timeline line */}
          <motion.div
            className={styles.timelineLine}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              className={styles.timelineItem}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
                rotateY: index % 2 === 0 ? -10 : 10,
              }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{ perspective: 1000 }}
            >
              <motion.div
                className={styles.timelineDot}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.2 + 0.3,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.3 }}
              >
                {exp.current && (
                  <motion.div
                    className={styles.pulseDot}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.div>

              <motion.div
                className={styles.timelineContent}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(124, 124, 248, 0.25)",
                  borderColor: "var(--accent-primary)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.timelineHeader}>
                  <div>
                    <motion.h3
                      className={styles.position}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.2 }}
                    >
                      {exp.position}
                    </motion.h3>
                    <motion.p
                      className={styles.company}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      whileHover={{ color: "var(--accent-primary)" }}
                    >
                      @ {exp.company}
                    </motion.p>
                  </div>
                  <motion.span
                    className={styles.date}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                  >
                    {formatDate(exp.startDate, false)} —{" "}
                    {formatDate(exp.endDate, exp.current)}
                  </motion.span>
                </div>

                <motion.p
                  className={styles.description}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {exp.description}
                </motion.p>

                <div className={styles.technologies}>
                  {exp.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className={styles.tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.2 + 0.5 + techIndex * 0.05,
                      }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "var(--accent-primary)",
                        color: "white",
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
