"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "./research-papers.module.css";

interface Paper {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  topics: string[];
  publishedYear?: number;
  externalUrl?: string;
  pdfFilename?: string;
  order: number;
  createdAt: string;
}

interface FormShape {
  title: string;
  authors: string;
  abstract: string;
  topics: string;
  publishedYear: string;
  externalUrl: string;
  pdfFile: string;
  pdfFilename: string;
  order: number;
}

const blankForm: FormShape = {
  title: "",
  authors: "",
  abstract: "",
  topics: "",
  publishedYear: "",
  externalUrl: "",
  pdfFile: "",
  pdfFilename: "",
  order: 0,
};

export default function AdminResearchPapers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormShape>(blankForm);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!showForm) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [showForm, editingId]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (session) loadPapers();
  }, [session]);

  const loadPapers = async () => {
    try {
      const res = await fetch("/api/research-papers", { cache: "no-store" });
      const data = await res.json();
      setPapers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("load papers", e);
    } finally {
      setLoading(false);
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setForm((f) => ({
        ...f,
        pdfFile: base64,
        pdfFilename: f.pdfFilename || file.name,
      }));
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setForm(blankForm);
    setEditingId(null);
    setShowForm(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      authors: form.authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      abstract: form.abstract,
      topics: form.topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publishedYear: form.publishedYear
        ? Number(form.publishedYear)
        : undefined,
      externalUrl: form.externalUrl || undefined,
      pdfFile: form.pdfFile || undefined,
      pdfFilename: form.pdfFilename || undefined,
      order: form.order,
    };

    try {
      const url = editingId
        ? `/api/research-papers/${editingId}`
        : "/api/research-papers";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Save failed: ${data.error || res.statusText}`);
        return;
      }
      reset();
      loadPapers();
    } catch (e) {
      console.error("save paper", e);
      alert("Error saving paper");
    }
  };

  const onEdit = async (p: Paper) => {
    // Fetch full record (includes pdfFile) so the existing PDF is
    // preserved if the admin doesn't re-upload.
    try {
      const res = await fetch(`/api/research-papers/${p._id}`, {
        cache: "no-store",
      });
      const full = await res.json();
      setForm({
        title: full.title || "",
        authors: (full.authors || []).join(", "),
        abstract: full.abstract || "",
        topics: (full.topics || []).join(", "),
        publishedYear: full.publishedYear?.toString() || "",
        externalUrl: full.externalUrl || "",
        pdfFile: full.pdfFile || "",
        pdfFilename: full.pdfFilename || "",
        order: full.order || 0,
      });
      setEditingId(full._id);
      setShowForm(true);
    } catch {
      // Fall back to the list-row data
      setForm({
        title: p.title || "",
        authors: (p.authors || []).join(", "),
        abstract: p.abstract || "",
        topics: (p.topics || []).join(", "),
        publishedYear: p.publishedYear?.toString() || "",
        externalUrl: p.externalUrl || "",
        pdfFile: "",
        pdfFilename: p.pdfFilename || "",
        order: p.order || 0,
      });
      setEditingId(p._id);
      setShowForm(true);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this research paper?")) return;
    try {
      const res = await fetch(`/api/research-papers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) loadPapers();
    } catch (e) {
      console.error("delete paper", e);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className={styles.layout}>
        <AdminSidebar />
        <main className={styles.main}>
          <div className={styles.empty}>Loading…</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Research Papers</h1>
          <button
            className={styles.addBtn}
            onClick={() => {
              setForm(blankForm);
              setEditingId(null);
              setShowForm((s) => !s);
            }}
          >
            {showForm ? "Close" : "Add Paper"}
          </button>
        </div>

        {showForm && (
          <form
            ref={formRef}
            className={styles.formCard}
            onSubmit={onSubmit}
          >
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.full}`}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Authors (comma separated)</label>
                <input
                  className={styles.input}
                  value={form.authors}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, authors: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Topics (comma separated)</label>
                <input
                  className={styles.input}
                  value={form.topics}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, topics: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Year</label>
                <input
                  type="number"
                  className={styles.input}
                  value={form.publishedYear}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, publishedYear: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Display order</label>
                <input
                  type="number"
                  className={styles.input}
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      order: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className={`${styles.formGroup} ${styles.full}`}>
                <label className={styles.label}>External link (arXiv, DOI…)</label>
                <input
                  className={styles.input}
                  value={form.externalUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, externalUrl: e.target.value }))
                  }
                />
              </div>

              <div className={`${styles.formGroup} ${styles.full}`}>
                <label className={styles.label}>Abstract</label>
                <textarea
                  className={styles.textarea}
                  required
                  value={form.abstract}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, abstract: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>PDF file (optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className={styles.fileInput}
                  onChange={onPickFile}
                />
                {uploading && (
                  <span className={styles.rowSub}>Encoding…</span>
                )}
                {form.pdfFile && !uploading && (
                  <span className={styles.rowSub}>
                    PDF stored ({Math.round(form.pdfFile.length / 1024)} kB)
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>PDF filename</label>
                <input
                  className={styles.input}
                  placeholder="paper_title.pdf"
                  value={form.pdfFilename}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pdfFilename: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={uploading}
                >
                  {editingId ? "Save changes" : "Add paper"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={reset}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div className={styles.list}>
          {papers.length === 0 && (
            <div className={styles.empty}>
              No research papers yet. Click “Add Paper” to upload one.
            </div>
          )}
          {papers.map((p) => (
            <div key={p._id} className={styles.row}>
              <div className={styles.rowMeta}>
                <div className={styles.rowTitle}>{p.title}</div>
                <div className={styles.rowSub}>
                  {(p.authors || []).join(", ")}
                  {p.publishedYear ? ` · ${p.publishedYear}` : ""}
                  {p.topics?.length ? ` · ${p.topics.join(", ")}` : ""}
                </div>
              </div>
              <div className={styles.rowActions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.danger}`}
                  onClick={() => onDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
