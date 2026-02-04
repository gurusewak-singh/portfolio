import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#" className={styles.logo}>
              <span className={styles.logoText}>Gurusewak</span>
              <span className={styles.logoDot}>.in</span>
            </a>
            <p className={styles.tagline}>
              Building intelligent systems and beautiful experiences.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Navigation</h4>
              <ul className={styles.linkList}>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Connect</h4>
              <ul className={styles.linkList}>
                <li><a href="https://github.com/gurusewak-singh" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://linkedin.com/in/gurusewak122" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="mailto:singhgurusewakk@gmail.com">Email</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Gurusewak.in All rights reserved.
          </p>
          <p className={styles.credit}>
            Designed & Built with <span className={styles.heart}>♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
