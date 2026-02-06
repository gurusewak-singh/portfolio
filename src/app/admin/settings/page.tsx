"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./settings.module.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Setting {
  _id: string;
  key: string;
  value: string;
  type: string;
  label: string;
}

const imageSettings = [
  {
    key: "profile_image",
    label: "Profile Image (About Section)",
    placeholder: "/profile.jpg",
  },
  { key: "hero_photo", label: "Hero Photo (Main Photo)", placeholder: "" },
  { key: "hero_background", label: "Hero Background Image", placeholder: "" },
];

const resumeSetting = {
  key: "resume_file",
  label: "Resume (PDF)",
  placeholder: "",
};

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value || "";
  };

  const handleImageUpload = async (key: string, file: File) => {
    setSaving(key);
    setMessage(null);

    try {
      // Convert to base64 for simple storage (for production, use a proper file upload service)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            value: base64,
            type: "image",
            label: imageSettings.find((s) => s.key === key)?.label || key,
          }),
        });

        if (res.ok) {
          await fetchSettings();
          setMessage({ type: "success", text: "Image updated successfully!" });
        } else {
          setMessage({ type: "error", text: "Failed to update image" });
        }
        setSaving(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ type: "error", text: "Failed to upload image" });
      setSaving(null);
    }
  };

  const handleUrlSave = async (key: string, url: string) => {
    setSaving(key);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: url,
          type: "image",
          label: imageSettings.find((s) => s.key === key)?.label || key,
        }),
      });

      if (res.ok) {
        await fetchSettings();
        setMessage({
          type: "success",
          text: "Image URL updated successfully!",
        });
      } else {
        setMessage({ type: "error", text: "Failed to update image URL" });
      }
    } catch (error) {
      console.error("Error saving URL:", error);
      setMessage({ type: "error", text: "Failed to save URL" });
    } finally {
      setSaving(null);
    }
  };

  const handleRemoveImage = async (key: string) => {
    if (!confirm("Are you sure you want to remove this?")) return;

    setSaving(key);
    try {
      const res = await fetch(`/api/settings?key=${key}`, { method: "DELETE" });
      if (res.ok) {
        await fetchSettings();
        setMessage({ type: "success", text: "Removed successfully!" });
      }
    } catch (error) {
      console.error("Error removing:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setSaving(resumeSetting.key);
    setMessage(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: resumeSetting.key,
            value: base64,
            type: "file",
            label: resumeSetting.label,
          }),
        });

        if (res.ok) {
          await fetchSettings();
          setMessage({
            type: "success",
            text: "Resume uploaded successfully!",
          });
        } else {
          setMessage({ type: "error", text: "Failed to upload resume" });
        }
        setSaving(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setMessage({ type: "error", text: "Failed to upload resume" });
      setSaving(null);
    }
  };

  const handleResumeUrlSave = async (url: string) => {
    setSaving(resumeSetting.key);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: resumeSetting.key,
          value: url,
          type: "file",
          label: resumeSetting.label,
        }),
      });

      if (res.ok) {
        await fetchSettings();
        setMessage({
          type: "success",
          text: "Resume URL updated successfully!",
        });
      } else {
        setMessage({ type: "error", text: "Failed to update resume URL" });
      }
    } catch (error) {
      console.error("Error saving URL:", error);
      setMessage({ type: "error", text: "Failed to save URL" });
    } finally {
      setSaving(null);
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
          <h1 className={styles.title}>Site Settings</h1>
          <p className={styles.subtitle}>
            Manage your portfolio images and settings
          </p>
        </header>

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.settingsGrid}>
          {imageSettings.map((setting) => {
            const currentValue = getSettingValue(setting.key);
            const isBase64 = currentValue.startsWith("data:");

            return (
              <div key={setting.key} className={styles.settingCard}>
                <h3 className={styles.settingLabel}>{setting.label}</h3>

                <div className={styles.imagePreview}>
                  {currentValue ? (
                    <Image
                      src={currentValue}
                      alt={setting.label}
                      width={200}
                      height={200}
                      style={{ objectFit: "cover" }}
                      unoptimized={isBase64}
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <span>No image set</span>
                    </div>
                  )}
                </div>

                <div className={styles.uploadSection}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      fileInputRefs.current[setting.key] = el;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(setting.key, file);
                    }}
                    className={styles.fileInput}
                  />
                  <button
                    onClick={() => fileInputRefs.current[setting.key]?.click()}
                    className={styles.uploadBtn}
                    disabled={saving === setting.key}
                  >
                    {saving === setting.key ? "Uploading..." : "Upload Image"}
                  </button>
                </div>

                <div className={styles.urlSection}>
                  <span className={styles.orText}>— or use URL —</span>
                  <div className={styles.urlInput}>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={!isBase64 ? currentValue : ""}
                      id={`url-${setting.key}`}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          `url-${setting.key}`,
                        ) as HTMLInputElement;
                        if (input.value)
                          handleUrlSave(setting.key, input.value);
                      }}
                      disabled={saving === setting.key}
                    >
                      Save
                    </button>
                  </div>
                </div>

                {currentValue && (
                  <button
                    onClick={() => handleRemoveImage(setting.key)}
                    className={styles.removeBtn}
                    disabled={saving === setting.key}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Resume Upload Section */}
        <div className={styles.resumeSection}>
          <h2 className={styles.sectionTitle}>Resume / CV</h2>
          <div className={styles.settingCard}>
            <h3 className={styles.settingLabel}>{resumeSetting.label}</h3>

            <div className={styles.resumePreview}>
              {getSettingValue(resumeSetting.key) ? (
                <div className={styles.resumeFile}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>Resume uploaded</span>
                  <a
                    href={getSettingValue(resumeSetting.key)}
                    download="resume.pdf"
                    className={styles.downloadLink}
                  >
                    Download
                  </a>
                </div>
              ) : (
                <div className={styles.noResume}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>No resume uploaded</span>
                </div>
              )}
            </div>

            <div className={styles.uploadSection}>
              <input
                type="file"
                accept=".pdf"
                ref={(el) => {
                  fileInputRefs.current[resumeSetting.key] = el;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleResumeUpload(file);
                }}
                className={styles.fileInput}
              />
              <button
                onClick={() =>
                  fileInputRefs.current[resumeSetting.key]?.click()
                }
                className={styles.uploadBtn}
                disabled={saving === resumeSetting.key}
              >
                {saving === resumeSetting.key ? "Uploading..." : "Upload PDF"}
              </button>
            </div>

            <div className={styles.urlSection}>
              <span className={styles.orText}>— or use URL —</span>
              <div className={styles.urlInput}>
                <input
                  type="text"
                  placeholder="https://example.com/resume.pdf"
                  defaultValue={
                    !getSettingValue(resumeSetting.key).startsWith("data:")
                      ? getSettingValue(resumeSetting.key)
                      : ""
                  }
                  id={`url-${resumeSetting.key}`}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      `url-${resumeSetting.key}`,
                    ) as HTMLInputElement;
                    if (input.value) handleResumeUrlSave(input.value);
                  }}
                  disabled={saving === resumeSetting.key}
                >
                  Save
                </button>
              </div>
            </div>

            {getSettingValue(resumeSetting.key) && (
              <button
                onClick={() => handleRemoveImage(resumeSetting.key)}
                className={styles.removeBtn}
                disabled={saving === resumeSetting.key}
              >
                Remove Resume
              </button>
            )}
          </div>
        </div>

        <div className={styles.infoBox}>
          <h4>💡 Tips</h4>
          <ul>
            <li>
              <strong>Profile Image:</strong> Best size is 400x400px (square) -
              shows in About section
            </li>
            <li>
              <strong>Hero Photo:</strong> Best size is 400x400px (square) -
              main photo in Hero section
            </li>
            <li>
              <strong>Hero Background:</strong> Best size is 1920x1080px
              (landscape)
            </li>
            <li>
              <strong>Resume:</strong> Upload a PDF file (recommended under 2MB)
            </li>
            <li>
              Supported formats: JPG, PNG, WebP, GIF for images; PDF for resume
            </li>
            <li>For better performance, use optimized images under 500KB</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
