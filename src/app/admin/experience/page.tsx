'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './experience.module.css';

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

export default function AdminExperience() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    current: false,
    order: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) fetchExperiences();
  }, [session]);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience');
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      endDate: formData.current ? undefined : formData.endDate,
    };

    try {
      const url = editingId ? `/api/experience/${editingId}` : '/api/experience';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchExperiences();
        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description,
      technologies: exp.technologies.join(', '),
      startDate: exp.startDate.split('T')[0],
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      current: exp.current,
      order: 0,
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (res.ok) fetchExperiences();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({ company: '', position: '', description: '', technologies: '', startDate: '', endDate: '', current: false, order: 0 });
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
          <Link href="/" className={styles.logo}><span className={styles.logoText}>Guru</span><span className={styles.logoDot}>.</span></Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={styles.navItem}>Dashboard</Link>
          <Link href="/admin/projects" className={styles.navItem}>Projects</Link>
          <Link href="/admin/experience" className={`${styles.navItem} ${styles.active}`}>Experience</Link>
          <Link href="/admin/skills" className={styles.navItem}>Skills</Link>
          <Link href="/admin/messages" className={styles.navItem}>Messages</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Experience</h1>
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>+ Add Experience</button>
        </header>

        {showForm && (
          <div className={styles.formOverlay} onClick={() => resetForm()}>
            <form className={styles.form} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
              <h2>{editingId ? 'Edit Experience' : 'Add Experience'}</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Company *</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Position *</label>
                  <input type="text" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} />
              </div>

              <div className={styles.formGroup}>
                <label>Technologies (comma-separated)</label>
                <input type="text" value={formData.technologies} onChange={e => setFormData({ ...formData, technologies: e.target.value })} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date *</label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} disabled={formData.current} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input type="checkbox" checked={formData.current} onChange={e => setFormData({ ...formData, current: e.target.checked })} />
                  Currently working here
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.list}>
          {experiences.map(exp => (
            <div key={exp._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{exp.position}</h3>
                  <p className={styles.company}>@ {exp.company}</p>
                </div>
                <span className={styles.date}>
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                </span>
              </div>
              <p className={styles.cardDesc}>{exp.description}</p>
              <div className={styles.cardActions}>
                <button onClick={() => handleEdit(exp)} className={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(exp._id)} className={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && !loading && (
          <div className={styles.empty}><p>No experience entries yet.</p></div>
        )}
      </main>
    </div>
  );
}
