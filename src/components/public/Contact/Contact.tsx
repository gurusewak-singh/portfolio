'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Contact.module.css';
import ScrollReveal from '@/components/animations/ScrollReveal';
import MagneticButton from '@/components/animations/MagneticButton';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Something went wrong');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Failed to send message. Please try again.');
      setStatus('error');
    }
  };

  const inputVariants = {
    focused: { 
      scale: 1.02, 
      boxShadow: "0 10px 30px rgba(99, 102, 241, 0.15)",
      borderColor: "var(--accent-primary)"
    },
    unfocused: { 
      scale: 1, 
      boxShadow: "none",
      borderColor: "var(--border-color)"
    }
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <ScrollReveal variant="fadeUp">
          <div className={styles.header}>
            <motion.span 
              className={styles.sectionNumber}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              05.
            </motion.span>
            <h2 className={styles.title}>Get In Touch</h2>
            <motion.div 
              className={styles.line}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal variant="fadeLeft" delay={0.2}>
            <div className={styles.info}>
              <motion.h3 
                className={styles.infoTitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Let&apos;s work together
              </motion.h3>
              <motion.p 
                className={styles.infoText}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                I&apos;m always interested in hearing about new projects and opportunities. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </motion.p>

              <div className={styles.contactMethods}>
                {[
                  { icon: 'email', label: 'Email', value: 'singhgurusewakk@gmail.com', href: 'mailto:singhgurusewakk@gmail.com' },
                  { icon: 'location', label: 'Location', value: 'Lucknow, India', href: null }
                ].map((item, index) => (
                  <motion.div 
                    key={item.label}
                    className={styles.contactItem}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <motion.div 
                      className={styles.contactIcon}
                      whileHover={{ 
                        rotate: 10, 
                        scale: 1.1,
                        backgroundColor: "var(--accent-primary)",
                        color: "white"
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {item.icon === 'email' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <path d="M22 6l-10 7L2 6"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      )}
                    </motion.div>
                    <div>
                      <span className={styles.contactLabel}>{item.label}</span>
                      {item.href ? (
                        <motion.a 
                          href={item.href} 
                          className={styles.contactValue}
                          whileHover={{ color: "var(--accent-primary)" }}
                        >
                          {item.value}
                        </motion.a>
                      ) : (
                        <span className={styles.contactValue}>{item.value}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={styles.social}>
                {[
                  { href: "https://github.com", path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" },
                  { href: "https://linkedin.com", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                  { href: "https://twitter.com", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }
                ].map((social, index) => (
                  <MagneticButton key={index} strength={0.4}>
                    <motion.a 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.socialLink}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 5,
                        backgroundColor: "var(--accent-primary)",
                        color: "white"
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d={social.path}/>
                      </svg>
                    </motion.a>
                  </MagneticButton>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeRight" delay={0.3}>
            <motion.form 
              className={styles.form} 
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className={styles.formRow}>
                {['name', 'email'].map((field, index) => (
                  <motion.div 
                    key={field}
                    className={styles.formGroup}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <label htmlFor={field} className={styles.label}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <motion.input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      className={styles.input}
                      placeholder={field === 'name' ? 'Your name' : 'your@email.com'}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      onFocus={() => setFocusedField(field)}
                      onBlur={() => setFocusedField(null)}
                      variants={inputVariants}
                      animate={focusedField === field ? 'focused' : 'unfocused'}
                      required
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className={styles.formGroup}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="subject" className={styles.label}>Subject</label>
                <motion.input
                  type="text"
                  id="subject"
                  className={styles.input}
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  variants={inputVariants}
                  animate={focusedField === 'subject' ? 'focused' : 'unfocused'}
                  required
                />
              </motion.div>

              <motion.div 
                className={styles.formGroup}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="message" className={styles.label}>Message</label>
                <motion.textarea
                  id="message"
                  className={styles.textarea}
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  variants={inputVariants}
                  animate={focusedField === 'message' ? 'focused' : 'unfocused'}
                  required
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div 
                    className={styles.successMessage}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ delay: 0.2 }}
                    >
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <path d="M22 4L12 14.01l-3-3"/>
                    </motion.svg>
                    Message sent successfully!
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div 
                    className={styles.errorMessage}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <MagneticButton strength={0.3}>
                <motion.button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={status === 'loading'}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  {status === 'loading' ? (
                    <>
                      <motion.span 
                        className={styles.spinner}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <motion.svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        whileHover={{ x: 5, y: -5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </motion.svg>
                    </>
                  )}
                </motion.button>
              </MagneticButton>
            </motion.form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
