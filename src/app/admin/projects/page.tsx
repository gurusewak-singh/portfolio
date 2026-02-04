'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './projects.module.css';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  featured: boolean;
  createdAt: string;
}

export default function AdminProjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchProjects();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: '',
      technologies: project.technologies.join(', '),
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      featured: project.featured,
      order: 0,
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      technologies: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (status === 'loading' || loading) {
    return <div className={styles.loading}><div className={styles.spinner}></div></div>;
  }

  if (!session) return null;

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
          <Link href="/admin/dashboard" className={styles.navItem}>Dashboard</Link>
          <Link href="/admin/projects" className={`${styles.navItem} ${styles.active}`}>Projects</Link>
          <Link href="/admin/experience" className={styles.navItem}>Experience</Link>
          <Link href="/admin/skills" className={styles.navItem}>Skills</Link>
          <Link href="/admin/messages" className={styles.navItem}>Messages</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Projects</h1>
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            + Add Project
          </button>
        </header>

        {showForm && (
          <div className={styles.formOverlay} onClick={() => resetForm()}>
            <form className={styles.form} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
              <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
              
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Live URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Featured Project
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.grid}>
          {projects.map(project => (
            <div key={project._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{project.title}</h3>
                {project.featured && <span className={styles.badge}>Featured</span>}
              </div>
              <p className={styles.cardDesc}>{project.description}</p>
              <div className={styles.cardTech}>
                {project.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className={styles.tag}>{tech}</span>
                ))}
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => handleEdit(project)} className={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(project._id)} className={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className={styles.empty}>
            <p>No projects yet. Add your first project!</p>
          </div>
        )}
      </main>
    </div>
  );
}
