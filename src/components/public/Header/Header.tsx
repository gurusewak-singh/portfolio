"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import styles from "./Header.module.css";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const res = await fetch("/api/settings?key=resume_file");
        const data = await res.json();
        if (data.value) {
          setResumeUrl(data.value);
        }
      } catch (error) {
        console.error("Error fetching resume URL:", error);
      }
    };

    fetchResumeUrl();
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <a href="#" className={styles.logo}>
          <span className={styles.logoText}>Gurusewak</span>
          <span className={styles.logoDot}>.in</span>
        </a>

        <nav
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.navLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <a
            href={resumeUrl}
            download="Gurusewak_Resume.pdf"
            className={styles.resumeBtn}
          >
            Resume
          </a>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ""}`}
            ></span>
          </button>
        </div>
      </div>
    </header>
  );
}
