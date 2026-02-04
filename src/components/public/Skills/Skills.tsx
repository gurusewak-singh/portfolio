"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Skills.module.css";
import TiltCard from "@/components/animations/TiltCard";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { AnimatedProgress } from "@/components/animations/AnimatedCounter";

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

const placeholderSkills: Skill[] = [
  // ML & AI
  { _id: "1", name: "Python", category: "ml", proficiency: 95 },
  { _id: "2", name: "TensorFlow", category: "ml", proficiency: 88 },
  { _id: "3", name: "PyTorch", category: "ml", proficiency: 85 },
  { _id: "4", name: "Scikit-learn", category: "ml", proficiency: 90 },
  { _id: "5", name: "Deep Learning", category: "ml", proficiency: 85 },
  { _id: "6", name: "NLP", category: "ml", proficiency: 80 },
  // Backend
  { _id: "11", name: "Node.js", category: "backend", proficiency: 88 },
  { _id: "12", name: "FastAPI", category: "backend", proficiency: 85 },
  { _id: "13", name: "Express.js", category: "backend", proficiency: 82 },
  { _id: "14", name: "GraphQL", category: "backend", proficiency: 75 },
  // Database
  { _id: "15", name: "MongoDB", category: "database", proficiency: 88 },
  { _id: "16", name: "PostgreSQL", category: "database", proficiency: 85 },
  { _id: "17", name: "Redis", category: "database", proficiency: 78 },
  // Tools
  { _id: "18", name: "Docker", category: "tools", proficiency: 85 },
  { _id: "19", name: "Git", category: "tools", proficiency: 92 },
  { _id: "20", name: "AWS", category: "tools", proficiency: 80 },
  { _id: "21", name: "Linux", category: "tools", proficiency: 85 },
];

const categories = [
  { id: "all", label: "All Skills" },
  { id: "ml", label: "ML & AI" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "tools", label: "Tools" },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(placeholderSkills);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setSkills(data);
          }
        }
      } catch (error) {
        console.log("Using placeholder skills");
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <ScrollReveal variant="fadeUp">
          <div className={styles.header}>
            <motion.span
              className={styles.sectionNumber}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              04.
            </motion.span>
            <h2 className={styles.title}>Skills & Technologies</h2>
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

        <ScrollReveal variant="fadeUp" delay={0.2}>
          <p className={styles.subtitle}>
            A comprehensive overview of my technical skills and the technologies
            I work with.
          </p>
        </ScrollReveal>

        <div className={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TiltCard tiltIntensity={8} glareOpacity={0.08} scale={1.03}>
                <div className={styles.skillCard}>
                  <div className={styles.skillHeader}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillPercent}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <AnimatedProgress
                    value={skill.proficiency}
                    className={styles.progressBar}
                    barClassName={styles.progress}
                    duration={1 + index * 0.05}
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
