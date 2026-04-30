"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./messages.module.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

type SendState = "idle" | "sending" | "sent" | "error";

export default function AdminMessages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (session) fetchMessages();
  }, [session]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setReplyOpen(false);
    setReplyBody("");
    setSendState("idle");
    setErrorMessage("");
  };

  const sendReply = async () => {
    if (!selected || !replyBody.trim()) return;
    setSendState("sending");
    setErrorMessage("");
    try {
      const res = await fetch(`/api/messages/${selected._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || "Failed to send reply");
        setSendState("error");
        return;
      }
      setSendState("sent");
      // Auto-close after a short success state
      setTimeout(() => {
        closeModal();
      }, 1400);
    } catch (e) {
      console.error("Send reply failed:", e);
      setErrorMessage("Network error. Please try again.");
      setSendState("error");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className={styles.container}>
      <AdminSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Messages</h1>
        </header>

        <div className={styles.list}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={styles.card}
              onClick={() => setSelected(msg)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.sender}>{msg.name}</span>
                <span className={styles.date}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.subject}>{msg.subject}</div>
              <div className={styles.preview}>
                {msg.message.substring(0, 100)}
                {msg.message.length > 100 ? "…" : ""}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className={styles.empty}>No messages yet</div>
          )}
        </div>

        {selected && (
          <div className={styles.modal} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeModal}
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <h2 className={styles.modalTitle}>{selected.subject}</h2>
              <p className={styles.modalFrom}>
                <span className={styles.modalFromLabel}>From</span>
                <span className={styles.modalFromValue}>
                  {selected.name}{" "}
                  <a
                    href={`mailto:${selected.email}`}
                    className={styles.modalFromEmail}
                  >
                    &lt;{selected.email}&gt;
                  </a>
                </span>
              </p>
              <p className={styles.messageBody}>{selected.message}</p>

              {!replyOpen && (
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.replyBtn}
                    onClick={() => setReplyOpen(true)}
                  >
                    Reply
                  </button>
                </div>
              )}

              {replyOpen && (
                <div className={styles.replyPanel}>
                  <label className={styles.replyLabel}>
                    Your reply to {selected.name}
                  </label>
                  <textarea
                    className={styles.replyTextarea}
                    placeholder={`Hi ${selected.name},\n\n…`}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    disabled={sendState === "sending" || sendState === "sent"}
                    rows={6}
                  />

                  {sendState === "error" && errorMessage && (
                    <div className={styles.replyError}>{errorMessage}</div>
                  )}
                  {sendState === "sent" && (
                    <div className={styles.replySuccess}>
                      Reply sent to {selected.email}
                    </div>
                  )}

                  <div className={styles.replyActions}>
                    <button
                      type="button"
                      className={styles.replyCancel}
                      onClick={() => {
                        setReplyOpen(false);
                        setReplyBody("");
                        setSendState("idle");
                        setErrorMessage("");
                      }}
                      disabled={sendState === "sending"}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.replySend}
                      onClick={sendReply}
                      disabled={
                        !replyBody.trim() ||
                        sendState === "sending" ||
                        sendState === "sent"
                      }
                    >
                      {sendState === "sending"
                        ? "Sending…"
                        : sendState === "sent"
                          ? "Sent ✓"
                          : "Send reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
