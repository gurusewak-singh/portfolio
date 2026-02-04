"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./skills.module.css";

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

const categories = [
  { id: "ml", label: "ML & AI" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "tools", label: "Tools" },
  { id: "other", label: "Other" },
];

export default function AdminSkills() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "ml",
    proficiency: 50,
    order: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (session) fetchSkills();
  }, [session]);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchSkills();
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      order: 0,
    });
    setEditingId(skill._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) fetchSkills();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", category: "ml", proficiency: 50, order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!session) return null;

  const groupedSkills = categories.reduce(
    (acc, cat) => {
      acc[cat.id] = skills.filter((s) => s.category === cat.id);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>Guru</span>
            <span className={styles.logoDot}>.</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={styles.navItem}>
            Dashboard
          </Link>
          <Link href="/admin/projects" className={styles.navItem}>
            Projects
          </Link>
          <Link href="/admin/experience" className={styles.navItem}>
            Experience
          </Link>
          <Link
            href="/admin/skills"
            className={`${styles.navItem} ${styles.active}`}
          >
            Skills
          </Link>
          <Link href="/admin/messages" className={styles.navItem}>
            Messages
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Skills</h1>
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            + Add Skill
          </button>
        </header>

        {showForm && (
          <div className={styles.formOverlay} onClick={() => resetForm()}>
            <form
              className={styles.form}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
            >
              <h2>{editingId ? "Edit Skill" : "Add Skill"}</h2>

              <div className={styles.formGroup}>
                <label>Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Proficiency: {formData.proficiency}%</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proficiency: parseInt(e.target.value),
                    })
                  }
                  className={styles.range}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.categories}>
          {categories.map(
            (cat) =>
              groupedSkills[cat.id]?.length > 0 && (
                <div key={cat.id} className={styles.category}>
                  <h3 className={styles.categoryTitle}>{cat.label}</h3>
                  <div className={styles.skillsGrid}>
                    {groupedSkills[cat.id].map((skill) => (
                      <div key={skill._id} className={styles.skillCard}>
                        <div className={styles.skillHeader}>
                          <span className={styles.skillName}>{skill.name}</span>
                          <span className={styles.skillPercent}>
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progress}
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                        <div className={styles.skillActions}>
                          <button
                            onClick={() => handleEdit(skill)}
                            className={styles.editBtn}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>

        {skills.length === 0 && !loading && (
          <div className={styles.empty}>
            <p>No skills added yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
