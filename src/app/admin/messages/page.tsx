'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './messages.module.css';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminMessages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (session) fetchMessages();
  }, [session]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
          <Link href="/admin/experience" className={styles.navItem}>Experience</Link>
          <Link href="/admin/skills" className={styles.navItem}>Skills</Link>
          <Link href="/admin/messages" className={`${styles.navItem} ${styles.active}`}>Messages</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Messages</h1>
        </header>

        <div className={styles.list}>
          {messages.map(msg => (
            <div key={msg._id} className={styles.card} onClick={() => setSelectedMessage(msg)}>
              <div className={styles.cardHeader}>
                <span className={styles.sender}>{msg.name}</span>
                <span className={styles.date}>{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.subject}>{msg.subject}</div>
              <div className={styles.preview}>{msg.message.substring(0, 100)}...</div>
            </div>
          ))}
          {messages.length === 0 && <div className={styles.empty}>No messages yet</div>}
        </div>

        {selectedMessage && (
          <div className={styles.modal} onClick={() => setSelectedMessage(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>{selectedMessage.subject}</h2>
              <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
              <p className={styles.messageBody}>{selectedMessage.message}</p>
              <a href={`mailto:${selectedMessage.email}`} className={styles.replyBtn}>Reply</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
