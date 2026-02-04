"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import styles from "./Projects.module.css";
import TiltCard from "@/components/animations/TiltCard";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

// Project Modal Component
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Set portal root after mount
    setPortalRoot(document.body);
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!portalRoot) return null;

  return createPortal(
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.4,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <motion.div
            className={styles.modalIcon}
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </motion.div>

          <div className={styles.modalLinks}>
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalLink}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>View Code</span>
              </motion.a>
            )}
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.modalLink} ${styles.modalLinkPrimary}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                <span>Live Demo</span>
              </motion.a>
            )}
          </div>
        </div>

        <motion.h2
          className={styles.modalTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {project.title}
        </motion.h2>

        <motion.p
          className={styles.modalDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {project.description}
        </motion.p>

        <motion.div
          className={styles.modalTechSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className={styles.modalTechTitle}>Technologies Used</h3>
          <ul className={styles.modalTechList}>
            {project.technologies.map((tech, index) => (
              <motion.li
                key={tech}
                className={styles.modalTechItem}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {tech}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {project.featured && (
          <motion.div
            className={styles.modalFeaturedBadge}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            ⭐ Featured Project
          </motion.div>
        )}
      </motion.div>
    </motion.div>,
    portalRoot,
  );
}

// Placeholder projects for initial display
const placeholderProjects: Project[] = [
  {
    _id: "1",
    title: "AI-Powered Analytics Dashboard",
    description:
      "A comprehensive analytics platform that uses machine learning to provide predictive insights and real-time data visualization for business intelligence.",
    technologies: ["Python", "TensorFlow", "React", "D3.js", "PostgreSQL"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
  },
  {
    _id: "2",
    title: "Natural Language Processing API",
    description:
      "RESTful API service that provides sentiment analysis, entity extraction, and text classification capabilities using state-of-the-art transformer models.",
    technologies: ["Python", "FastAPI", "Hugging Face", "Docker", "AWS"],
    githubUrl: "#",
    featured: true,
  },
  {
    _id: "3",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with real-time inventory management, payment processing, and an AI-powered recommendation engine.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe", "Redis"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
  },
  {
    _id: "4",
    title: "Computer Vision Object Detection",
    description:
      "Real-time object detection system trained on custom datasets for industrial quality control applications.",
    technologies: ["Python", "PyTorch", "OpenCV", "YOLO", "Flask"],
    githubUrl: "#",
    featured: false,
  },
  {
    _id: "5",
    title: "Automated Trading Bot",
    description:
      "Machine learning-based trading system that analyzes market trends and executes trades using reinforcement learning strategies.",
    technologies: ["Python", "Scikit-learn", "Pandas", "TensorFlow", "APIs"],
    githubUrl: "#",
    featured: false,
  },
  {
    _id: "6",
    title: "Healthcare Management System",
    description:
      "Comprehensive healthcare platform with patient management, appointment scheduling, and ML-powered diagnostic assistance.",
    technologies: ["React", "Node.js", "PostgreSQL", "Python", "Docker"],
    githubUrl: "#",
    liveUrl: "#",
    featured: false,
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(placeholderProjects);
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setProjects(data);
          }
        }
      } catch (error) {
        console.log("Using placeholder projects");
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <ScrollReveal variant="fadeUp">
          <div className={styles.header}>
            <motion.span
              className={styles.sectionNumber}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              02.
            </motion.span>
            <h2 className={styles.title}>Featured Projects</h2>
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
            Here are some of my recent projects that showcase my skills in
            machine learning and full-stack development.
          </p>
        </ScrollReveal>

        <motion.div
          className={styles.filters}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {["all", "featured"].map((f) => (
            <motion.button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
              onClick={() => setFilter(f as "all" | "featured")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f === "all" ? "All Projects" : "Featured"}
              {filter === f && (
                <motion.div
                  layoutId="activeFilter"
                  className={styles.activeIndicator}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        <div className={styles.grid}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className={styles.cardWrapper}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedProject(project);
                  }
                }}
              >
                <TiltCard tiltIntensity={10} glareOpacity={0.1} scale={1.02}>
                  <article className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.folderIcon}>
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                        </svg>
                      </div>
                      <div className={styles.cardLinks}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className={styles.cardLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live Demo"
                            className={styles.cardLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardDescription}>
                      {project.description}
                    </p>

                    <div className={styles.cardFooter}>
                      <ul className={styles.techList}>
                        {project.technologies
                          .slice(0, 4)
                          .map((tech, techIndex) => (
                            <li key={tech} className={styles.techItem}>
                              {tech}
                            </li>
                          ))}
                        {project.technologies.length > 4 && (
                          <li
                            className={`${styles.techItem} ${styles.techMore}`}
                          >
                            +{project.technologies.length - 4} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </article>
                </TiltCard>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
