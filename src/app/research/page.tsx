"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import SectionHeader from "@/components/public/SectionHeader";
import HeroBackground from "@/components/public/HeroBackground";
import ScrollProgress from "@/components/animations/ScrollProgress";
import { formatAbstract } from "@/lib/formatAbstract";
import styles from "./research.module.css";

const LoadingWrapper = dynamic(
  () =>
    import("@/components/3d/LoadingScreen").then((mod) => ({
      default: mod.LoadingWrapper,
    })),
  { ssr: false },
);

interface Paper {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  topics: string[];
  publishedYear?: number;
  externalUrl?: string;
  pdfFilename?: string;
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/research-papers", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setPapers(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <LoadingWrapper>
      <ScrollProgress />
      <Header />
      <main className={styles.page}>
        <HeroBackground />
        <div className={styles.container} style={{ position: "relative", zIndex: 3 }}>
          <SectionHeader
            number="00"
            label="Library"
            title="Research Paper Collection"
            subtitle="A growing archive of research I'm reading, writing, and exploring — primarily in machine learning, generative AI, and applied systems."
          />

          {!loaded && <div className={styles.empty}>Loading…</div>}
          {loaded && papers.length === 0 && (
            <div className={styles.empty}>No papers published yet.</div>
          )}

          <div className={styles.list}>
            {papers.map((p) => (
              <article key={p._id} className={styles.card}>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  {p.publishedYear && (
                    <span className={styles.year}>{p.publishedYear}</span>
                  )}
                </div>
                {p.authors?.length > 0 && (
                  <p className={styles.authors}>{p.authors.join(", ")}</p>
                )}
                <p className={styles.abstract}>
                  {formatAbstract(p.abstract)}
                </p>
                {p.topics?.length > 0 && (
                  <ul className={styles.topics}>
                    {p.topics.map((t) => (
                      <li key={t} className={styles.topic}>
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div className={styles.actions}>
                  <a
                    href={`/api/research-papers/${p._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.btn} ${styles.primary}`}
                  >
                    Read PDF
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                  {p.externalUrl && (
                    <a
                      href={p.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.btn} ${styles.secondary}`}
                    >
                      Source
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </LoadingWrapper>
  );
}
