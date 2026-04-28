"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/public/SectionHeader";
import styles from "./ResearchCallout.module.css";

interface PaperPreview {
  _id: string;
  title: string;
  publishedYear?: number;
}

const PREVIEW_LIMIT = 3;

export default function ResearchCallout() {
  const [previews, setPreviews] = useState<PaperPreview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/research-papers", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: PaperPreview[]) => {
        setPreviews(Array.isArray(data) ? data.slice(0, PREVIEW_LIMIT) : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <section id="research" className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          number="05"
          label="Library"
          title="Research Paper Collection"
          subtitle="Papers I'm reading, writing, and revisiting — in machine learning, generative AI, and applied systems."
        />

        <div className={styles.card}>
          <div className={styles.lead}>
            <span className={styles.eyebrow}>Curated · Always growing</span>
            <h3 className={styles.headline}>
              Browse the full archive of papers and notes.
            </h3>
            <p className={styles.copy}>
              Each entry includes the paper&apos;s abstract, topics, and the
              full PDF where available. Source links point to arXiv or the
              original publication.
            </p>
            <div className={styles.actions}>
              <Link href="/research" className={styles.primary}>
                View Collection
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className={styles.previewList} aria-label="Recent papers">
            {!loaded && (
              <div className={styles.previewEmpty}>Loading…</div>
            )}
            {loaded && previews.length === 0 && (
              <div className={styles.previewEmpty}>No papers yet.</div>
            )}
            {previews.map((p, i) => (
              <Link
                key={p._id}
                href="/research"
                className={styles.previewItem}
              >
                <span className={styles.previewIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.previewTitle}>{p.title}</span>
                {p.publishedYear && (
                  <span className={styles.previewYear}>
                    {p.publishedYear}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
