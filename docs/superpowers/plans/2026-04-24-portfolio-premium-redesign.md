# Portfolio Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the public-facing portfolio to a premium editorial black finish with a full-bleed Spline 3D hero background, three-tier glassmorphism system, numbered section eyebrows, and refined motion — while leaving admin, API, and data layers untouched.

**Architecture:** New `SplineHero` component replaces the existing R3F Hero background. Three reusable building blocks (`SectionHeader`, `RevealText`, `ScrollProgress`) formalize the repeating UI patterns already scattered across sections. Global token system (three glass tiers + motion + type scale) lives in `globals.css` and is consumed by each section's module CSS. Existing R3F scenes (`About3DScene`, `Skills3DElement`) and the Hero photo are removed — Spline becomes the only 3D element.

**Tech Stack:** Next.js 16, React 19, Framer Motion 12, `@splinetool/react-spline` (NEW), Tailwind 4, TypeScript, CSS Modules.

**Note on testing:** This is a CSS/UI redesign. Verification is via `npm run lint`, `npx tsc --noEmit`, `npm run build`, and visual smoke-testing in `npm run dev` — not unit tests. Each task's "verify" step reflects that.

**Branch:** Work continues on the existing `remake` branch. Do not touch `main`.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `src/components/public/SplineHero/SplineHero.tsx` | Dynamic-imported Spline scene with load-state fade, pointer-events disabled, fade-to-black vignette |
| `src/components/public/SplineHero/SplineHero.module.css` | Stage, vignette, skeleton styles |
| `src/components/public/SplineHero/index.ts` | Re-export |
| `src/components/public/SectionHeader/SectionHeader.tsx` | Reusable numbered eyebrow + display title (+ optional subtitle) |
| `src/components/public/SectionHeader/SectionHeader.module.css` | Eyebrow, expanding line, title styles |
| `src/components/public/SectionHeader/index.ts` | Re-export |
| `src/components/animations/ScrollProgress.tsx` | 1px top progress bar driven by `useScroll` + `useSpring` |
| `src/components/animations/RevealText.tsx` | Word-by-word masked reveal |
| `src/components/public/SectionDivider/SectionDivider.tsx` | 1px horizontal hairline between sections |
| `src/components/public/SectionDivider/SectionDivider.module.css` | Hairline gradient style |
| `src/components/public/SectionDivider/index.ts` | Re-export |

### Modified files

| Path | Summary |
|---|---|
| `package.json` | Add `@splinetool/react-spline` + `@splinetool/runtime` |
| `src/app/globals.css` | Add three-tier glass, motion, type scale, spacing tokens + utility classes |
| `src/app/page.tsx` | Mount `<ScrollProgress />` + `<SectionDivider />` between sections |
| `src/components/public/Hero/Hero.tsx` | Remove photo + R3F background + right column; center single-column layout; use `<SplineHero />` |
| `src/components/public/Hero/Hero.module.css` | Centered single-column, drop image/decoration styles |
| `src/components/public/About/About.tsx` | Remove `About3DScene`; use `<SectionHeader />`; upgrade photo to `glass-elevated` frame |
| `src/components/public/About/About.module.css` | Drop old section header block; premium photo frame + stat cards → `glass-panel` |
| `src/components/public/Projects/Projects.tsx` | Use `<SectionHeader />`; upgrade card → `glass-panel` |
| `src/components/public/Projects/Projects.module.css` | Drop old header block, `.card` → glass-panel with hover lift |
| `src/components/public/Experience/Experience.tsx` | Use `<SectionHeader />`; cards → `glass-panel` |
| `src/components/public/Experience/Experience.module.css` | Drop old header block, cards → glass-panel |
| `src/components/public/Skills/Skills.tsx` | Remove `Skills3DElement`; use `<SectionHeader />` |
| `src/components/public/Skills/Skills.module.css` | Drop 3D overlay styles + old header block; skill cards → glass-panel |
| `src/components/public/Contact/Contact.tsx` | Use `<SectionHeader />`; inputs → `glass-subtle` |
| `src/components/public/Contact/Contact.module.css` | Drop old header block, refined input focus ring |
| `src/components/public/Header/Header.tsx` | Add scroll-to-pill behavior via Framer Motion |
| `src/components/public/Header/Header.module.css` | Glass-elevated pill, active link underline |
| `src/components/public/Footer/Footer.module.css` | Minimal: pure black + 1px top hairline + 48px padding |
| `src/components/animations/MagneticButton.tsx` | Default `strength` 0.4 → 0.25 |
| `src/components/3d/Scene3D.tsx` | Remove unused `About3DScene` + `Skills3DElement` exports; keep `Hero3DScene` definition but stop exporting it |
| `src/components/3d/index.ts` | Drop unused exports |

### Untouched

All `/admin` routes, `/api` routes, `models`, `lib`, `context`, `layout.tsx`, `sitemap.ts`, `opengraph-image.tsx`, `LoadingScreen.tsx`, `InteractiveElements.tsx`, remaining animation components (`AnimatedCounter`, `CursorTrailer`, `FloatingElement`, `ParallaxSection`, `ScrollReveal`, `TiltCard`).

---

## Task Breakdown

Each task ends with a commit. Commit after every task so the branch history is rebuildable.

---

### Task 1: Install Spline dependencies

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install Spline packages**

Run (from `C:/Users/LOQ/OneDrive/Desktop/Guru Portfolio/portfolio`):
```bash
npm install @splinetool/react-spline @splinetool/runtime
```

Expected: packages added, no peer-dep errors (warnings OK).

- [ ] **Step 2: Verify package.json additions**

Open `package.json` and confirm both appear under `"dependencies"`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Spline dependencies"
```

---

### Task 2: Add design tokens to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append token block to `:root` (before closing `}` of the first `:root` block, around line 36)**

Insert these lines just before the closing `}` of `:root`:

```css
  /* === Three-tier glass system === */
  --glass-subtle-bg: rgba(255, 255, 255, 0.028);
  --glass-subtle-border: rgba(255, 255, 255, 0.06);
  --glass-subtle-blur: blur(16px) saturate(150%);

  --glass-panel-bg: rgba(255, 255, 255, 0.045);
  --glass-panel-border: rgba(255, 255, 255, 0.09);
  --glass-panel-blur: blur(32px) saturate(200%);
  --glass-panel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  --glass-panel-shadow:
    0 1px 0 rgba(0, 0, 0, 0.4),
    0 24px 48px -12px rgba(0, 0, 0, 0.6);

  --glass-elevated-bg: rgba(255, 255, 255, 0.07);
  --glass-elevated-border: rgba(255, 255, 255, 0.14);
  --glass-elevated-blur: blur(48px) saturate(200%);
  --glass-elevated-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  --glass-elevated-shadow:
    0 1px 0 rgba(0, 0, 0, 0.4),
    0 40px 80px -20px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.05);

  /* === Motion === */
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-out-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 800ms;

  /* === Rhythm === */
  --section-padding-y: 160px;
  --section-padding-y-mobile: 96px;
  --section-max-width: 1200px;
  --section-divider-bg: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
```

Repeat the same token block inside the `[data-theme="dark"]` selector (since both themes are identical per the existing file comment "Always dark — both themes identical").

- [ ] **Step 2: Append three glass utility classes after the existing `.glass` utility (around line 251)**

Insert:

```css
/* Glass tiers */
.glass-subtle {
  background: var(--glass-subtle-bg);
  border: 1px solid var(--glass-subtle-border);
  backdrop-filter: var(--glass-subtle-blur);
  -webkit-backdrop-filter: var(--glass-subtle-blur);
}

.glass-panel {
  background: var(--glass-panel-bg);
  border: 1px solid var(--glass-panel-border);
  backdrop-filter: var(--glass-panel-blur);
  -webkit-backdrop-filter: var(--glass-panel-blur);
  box-shadow: var(--glass-panel-highlight), var(--glass-panel-shadow);
}

.glass-elevated {
  background: var(--glass-elevated-bg);
  border: 1px solid var(--glass-elevated-border);
  backdrop-filter: var(--glass-elevated-blur);
  -webkit-backdrop-filter: var(--glass-elevated-blur);
  box-shadow: var(--glass-elevated-highlight), var(--glass-elevated-shadow);
}
```

- [ ] **Step 3: Bump `.section` padding**

Replace:
```css
.section {
  padding: 100px 0;
}
```
With:
```css
.section {
  padding: var(--section-padding-y) 0;
}
```

And update the mobile `@media (max-width: 768px)` override:
```css
  .section {
    padding: var(--section-padding-y-mobile) 0;
  }
```

- [ ] **Step 4: Verify — lint + type check**

```bash
npx tsc --noEmit
npm run lint
```

Expected: both clean.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(styles): add three-tier glass tokens, motion tokens, rhythm tokens"
```

---

### Task 3: Create ScrollProgress component

**Files:**
- Create: `src/components/animations/ScrollProgress.tsx`

- [ ] **Step 1: Write the component**

Create file with this content:

```tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: "rgba(255, 255, 255, 0.6)",
        mixBlendMode: "difference",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
```

- [ ] **Step 2: Verify compiles**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/ScrollProgress.tsx
git commit -m "feat(animations): add ScrollProgress top-bar component"
```

---

### Task 4: Create RevealText component

**Files:**
- Create: `src/components/animations/RevealText.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { motion, Variants } from "framer-motion";
import { ElementType } from "react";

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const wordVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function RevealText({
  text,
  as: Tag = "span",
  className,
  stagger = 0.04,
  delay = 0,
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <motion.span
        style={{ display: "inline-block" }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={stagger}
        transition={{ delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              paddingRight: "0.25em",
            }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
```

- [ ] **Step 2: Verify compiles**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/RevealText.tsx
git commit -m "feat(animations): add RevealText word-by-word mask reveal"
```

---

### Task 5: Create SectionHeader component

**Files:**
- Create: `src/components/public/SectionHeader/SectionHeader.tsx`
- Create: `src/components/public/SectionHeader/SectionHeader.module.css`
- Create: `src/components/public/SectionHeader/index.ts`

- [ ] **Step 1: Write the CSS module**

`src/components/public/SectionHeader/SectionHeader.module.css`:
```css
.header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 64px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: "DM Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
  font-weight: 400;
}

.eyebrowNumber {
  color: rgba(255, 255, 255, 0.7);
}

.eyebrowLine {
  height: 1px;
  background: rgba(255, 255, 255, 0.28);
  transform-origin: left;
}

.title {
  font-family: "Syne", sans-serif;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #ffffff;
  margin: 0;
}

.subtitle {
  font-family: "Outfit", sans-serif;
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.52);
  font-weight: 300;
  max-width: 620px;
  margin: 0;
}

@media (max-width: 768px) {
  .header {
    margin-bottom: 40px;
    gap: 16px;
  }
}
```

- [ ] **Step 2: Write the component**

`src/components/public/SectionHeader/SectionHeader.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import RevealText from "@/components/animations/RevealText";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  number,
  label,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <motion.div
        className={styles.eyebrow}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      >
        <span className={styles.eyebrowNumber}>{number}</span>
        <motion.span
          className={styles.eyebrowLine}
          style={{ display: "inline-block", width: 24 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        />
        <span>{label}</span>
      </motion.div>

      <RevealText as="h2" className={styles.title} text={title} />

      {subtitle && (
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write the index**

`src/components/public/SectionHeader/index.ts`:
```ts
export { default } from "./SectionHeader";
```

- [ ] **Step 4: Verify compiles**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/public/SectionHeader
git commit -m "feat(public): add reusable SectionHeader (numbered eyebrow + title)"
```

---

### Task 6: Create SectionDivider component

**Files:**
- Create: `src/components/public/SectionDivider/SectionDivider.tsx`
- Create: `src/components/public/SectionDivider/SectionDivider.module.css`
- Create: `src/components/public/SectionDivider/index.ts`

- [ ] **Step 1: CSS module**

`src/components/public/SectionDivider/SectionDivider.module.css`:
```css
.divider {
  width: 100%;
  max-width: var(--section-max-width);
  height: 1px;
  margin: 0 auto;
  background: var(--section-divider-bg);
}
```

- [ ] **Step 2: Component**

`src/components/public/SectionDivider/SectionDivider.tsx`:
```tsx
import styles from "./SectionDivider.module.css";

export default function SectionDivider() {
  return <div className={styles.divider} aria-hidden="true" />;
}
```

- [ ] **Step 3: Index**

`src/components/public/SectionDivider/index.ts`:
```ts
export { default } from "./SectionDivider";
```

- [ ] **Step 4: Commit**

```bash
git add src/components/public/SectionDivider
git commit -m "feat(public): add SectionDivider hairline"
```

---

### Task 7: Create SplineHero component

**Files:**
- Create: `src/components/public/SplineHero/SplineHero.tsx`
- Create: `src/components/public/SplineHero/SplineHero.module.css`
- Create: `src/components/public/SplineHero/index.ts`

- [ ] **Step 1: CSS module**

`src/components/public/SplineHero/SplineHero.module.css`:
```css
.stage {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  background: #000;
}

.skeleton {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 255, 255, 0.035), transparent),
    #000;
  transition: opacity 600ms var(--ease-out-smooth);
  pointer-events: none;
}

.sceneWrap {
  position: absolute;
  inset: 0;
  transition: opacity 800ms var(--ease-out-smooth);
}

.sceneWrap :global(canvas) {
  pointer-events: none !important;
}

.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.5) 100%),
    linear-gradient(to bottom, transparent 65%, #000 100%);
}
```

- [ ] **Step 2: Component**

`src/components/public/SplineHero/SplineHero.tsx`:
```tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import styles from "./SplineHero.module.css";

const Spline = dynamic(
  () => import("@splinetool/react-spline/next"),
  { ssr: false, loading: () => null },
);

const SCENE_URL =
  "https://prod.spline.design/uyjjdqlPYik3EmHd/scene.splinecode";

export default function SplineHero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.stage} aria-hidden="true">
      <div
        className={styles.skeleton}
        style={{ opacity: loaded ? 0 : 1 }}
      />
      <Suspense fallback={null}>
        <div
          className={styles.sceneWrap}
          style={{ opacity: loaded ? 1 : 0 }}
        >
          <Spline scene={SCENE_URL} onLoad={() => setLoaded(true)} />
        </div>
      </Suspense>
      <div className={styles.vignette} />
    </div>
  );
}
```

- [ ] **Step 3: Index**

`src/components/public/SplineHero/index.ts`:
```ts
export { default } from "./SplineHero";
```

- [ ] **Step 4: Verify compiles**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/public/SplineHero
git commit -m "feat(public): add SplineHero component with load-fade and vignette"
```

---

### Task 8: Redesign Hero section

**Files:**
- Modify: `src/components/public/Hero/Hero.tsx`
- Modify: `src/components/public/Hero/Hero.module.css`

- [ ] **Step 1: Replace `Hero.tsx` with the new single-column version**

Replace the entire file contents of `src/components/public/Hero/Hero.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import SplineHero from "@/components/public/SplineHero";
import MagneticButton from "@/components/animations/MagneticButton";
import ScrollReveal from "@/components/animations/ScrollReveal";

const roles = ["ML Engineer", "AI Enthusiast", "Problem Solver"];

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = roles[currentRole];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole]);

  return (
    <section className={styles.hero}>
      <SplineHero />

      <div className={styles.container}>
        <ScrollReveal variant="fadeUp" delay={0.2} className={styles.content}>
          <motion.p
            className={styles.greeting}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            className={styles.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.4,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            Gurusewak
          </motion.h1>

          <motion.div
            className={styles.roleWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className={styles.role}>
              {displayText}
              <motion.span
                className={styles.cursor}
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                |
              </motion.span>
            </span>
          </motion.div>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Building real-world AI systems that scale. Specialized in Generative
            AI, ML pipelines, and applied engineering. From models to
            production, I ship intelligent systems.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <MagneticButton strength={0.25}>
              <motion.a
                href="#projects"
                className={styles.primaryBtn}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
                }}
                whileTap={{ scale: 0.96 }}
              >
                View My Work
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </motion.a>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <motion.a
                href="#contact"
                className={styles.secondaryBtn}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Get In Touch
              </motion.a>
            </MagneticButton>
          </motion.div>

          <div className={styles.socialDivider} aria-hidden="true" />

          <motion.div
            className={styles.social}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {[
              {
                href: "https://github.com/gurusewak-singh",
                label: "GitHub",
                path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
              },
              {
                href: "https://linkedin.com/in/gurusewak122",
                label: "LinkedIn",
                path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
              },
              {
                href: "https://twitter.com/iamguruuu",
                label: "Twitter",
                path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
              },
            ].map((social, index) => (
              <MagneticButton key={social.label} strength={0.3}>
                <motion.a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.label}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.08 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.path} />
                  </svg>
                </motion.a>
              </MagneticButton>
            ))}
          </motion.div>
        </ScrollReveal>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          className={styles.mouse}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className={styles.wheel}
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll Down
        </motion.span>
      </motion.div>
    </section>
  );
}
```

Key changes: removed `Image`, `useTheme`, `usePreloadedAssets`, `Hero3DScene`, `FloatingElement` imports. Removed the entire `.imageWrapper` / `.imageContainer` / `.heroPhotoWrapper` / `.imageDecoration` block. Removed background image layer and overlay (Spline is the only background). Added `<SplineHero />`. Reduced `MagneticButton` strengths. Added a `.socialDivider` hairline between actions and social row.

- [ ] **Step 2: Rewrite `Hero.module.css` for centered single-column layout**

Replace entire file contents with:

```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 120px 0 80px;
  max-width: 100vw;
  background: #000;
  text-align: center;
}

.container {
  position: relative;
  z-index: 3;
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.greeting {
  font-family: "DM Mono", monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.48);
  font-weight: 400;
  margin-bottom: 20px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.name {
  font-family: "Syne", sans-serif;
  font-size: clamp(3.25rem, 9vw, 7rem);
  font-weight: 800;
  line-height: 0.95;
  margin-bottom: 18px;
  color: #ffffff;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.62) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.roleWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Outfit", sans-serif;
  font-size: 1.375rem;
  font-weight: 300;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.48);
  letter-spacing: -0.01em;
  min-height: 2rem;
}

.role {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

.cursor {
  color: rgba(255, 255, 255, 0.8);
  margin-left: 2px;
}

.description {
  font-family: "Outfit", sans-serif;
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.52);
  line-height: 1.8;
  margin: 0 auto 36px;
  max-width: 520px;
  font-weight: 300;
}

.actions {
  display: flex;
  gap: 14px;
  margin-bottom: 28px;
  justify-content: center;
}

.primaryBtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 8px;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 0.9375rem;
  background: #ffffff;
  color: #000;
  transition: all var(--duration-base) var(--ease-out-smooth);
  letter-spacing: 0.01em;
}

.primaryBtn:hover {
  background: rgba(255, 255, 255, 0.92);
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(255, 255, 255, 0.12);
}

.secondaryBtn {
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  border-radius: 8px;
  font-family: "Outfit", sans-serif;
  font-weight: 500;
  font-size: 0.9375rem;
  background: var(--glass-elevated-bg);
  backdrop-filter: var(--glass-elevated-blur);
  -webkit-backdrop-filter: var(--glass-elevated-blur);
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--glass-elevated-border);
  box-shadow: var(--glass-elevated-highlight);
  transition: all var(--duration-base) var(--ease-out-smooth);
  letter-spacing: 0.01em;
}

.secondaryBtn:hover {
  border-color: rgba(255, 255, 255, 0.28);
  color: #ffffff;
  background: rgba(255, 255, 255, 0.09);
}

.socialDivider {
  width: 48px;
  height: 1px;
  background: rgba(255, 255, 255, 0.18);
  margin: 16px auto 20px;
}

.social {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.socialLink {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--glass-subtle-bg);
  backdrop-filter: var(--glass-subtle-blur);
  -webkit-backdrop-filter: var(--glass-subtle-blur);
  border: 1px solid var(--glass-subtle-border);
  color: rgba(255, 255, 255, 0.62);
  transition: all var(--duration-base) var(--ease-out-smooth);
}

.socialLink:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.24);
  color: #ffffff;
  transform: translateY(-2px);
}

.scrollIndicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.3);
  font-family: "DM Mono", monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  z-index: 3;
}

.mouse {
  width: 20px;
  height: 33px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 10px;
  position: relative;
}

.wheel {
  width: 2.5px;
  height: 6px;
  background: rgba(255, 255, 255, 0.38);
  border-radius: 2px;
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 0 60px;
  }
  .container {
    padding: 0 20px;
  }
  .roleWrapper {
    font-size: 1.125rem;
  }
  .description {
    font-size: 1rem;
  }
  .actions {
    flex-direction: column;
    width: 100%;
  }
  .primaryBtn,
  .secondaryBtn {
    width: 100%;
    justify-content: center;
  }
  .scrollIndicator {
    display: none;
  }
}
```

- [ ] **Step 3: Verify compiles + lints**

```bash
npx tsc --noEmit
npm run lint
```

Expected: clean. If lint complains about unused imports from the old version, double-check the rewrite.

- [ ] **Step 4: Commit**

```bash
git add src/components/public/Hero/Hero.tsx src/components/public/Hero/Hero.module.css
git commit -m "feat(hero): replace two-column + R3F with centered Spline-backed hero"
```

---

### Task 9: Redesign About section

**Files:**
- Modify: `src/components/public/About/About.tsx`
- Modify: `src/components/public/About/About.module.css`

- [ ] **Step 1: Update `About.tsx` — swap inline header for `<SectionHeader />`, remove `About3DScene` references if any**

In `About.tsx`, replace the existing `<ScrollReveal>...<div className={styles.header}>...</div></ScrollReveal>` block (the block containing `01.`, `<h2>About Me</h2>`, and `<motion.div className={styles.line} />`) with:

```tsx
<SectionHeader number="01" label="About" title="Who I am" />
```

Add this import at the top of the file:
```tsx
import SectionHeader from "@/components/public/SectionHeader";
```

Remove the now-unused imports `motion` is still used later so keep it, but remove `ScrollReveal` from the header area only (it remains used lower in the paragraphs section).

- [ ] **Step 2: Upgrade photo frame and stats to new glass tiers in `About.module.css`**

Locate the existing `.imageContainer`, `.profileImage`, `.imageFrame`, and `.statItem` rules. Replace their backgrounds/borders/blur with the new tokens:

For `.profileImage`:
```css
.profileImage {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 18px;
  overflow: hidden;
  background: var(--glass-elevated-bg);
  border: 1px solid var(--glass-elevated-border);
  backdrop-filter: var(--glass-elevated-blur);
  -webkit-backdrop-filter: var(--glass-elevated-blur);
  box-shadow: var(--glass-elevated-highlight), var(--glass-elevated-shadow);
}
```

For `.statItem`:
```css
.statItem {
  background: var(--glass-panel-bg);
  border: 1px solid var(--glass-panel-border);
  backdrop-filter: var(--glass-panel-blur);
  -webkit-backdrop-filter: var(--glass-panel-blur);
  box-shadow: var(--glass-panel-highlight), var(--glass-panel-shadow);
  border-radius: 12px;
  padding: 20px;
  transition: all var(--duration-base) var(--ease-out-smooth);
}

.statItem:hover {
  background: var(--glass-elevated-bg);
  border-color: var(--glass-elevated-border);
  transform: translateY(-2px);
}
```

Delete the old `.header`, `.sectionNumber`, `.title`, `.line` block from `About.module.css` — they are now provided by `SectionHeader`.

- [ ] **Step 3: Verify compiles + lints**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/public/About
git commit -m "feat(about): use SectionHeader, upgrade photo + stats to new glass tiers"
```

---

### Task 10: Refine Projects section

**Files:**
- Modify: `src/components/public/Projects/Projects.tsx`
- Modify: `src/components/public/Projects/Projects.module.css`

- [ ] **Step 1: Swap inline header for `<SectionHeader />`**

In `Projects.tsx`:
- Add import: `import SectionHeader from "@/components/public/SectionHeader";`
- Replace the entire `<ScrollReveal variant="fadeUp"><div className={styles.header}>...</div></ScrollReveal>` and the subsequent `<ScrollReveal variant="fadeUp" delay={0.2}><p className={styles.subtitle}>...` with a single:

```tsx
<SectionHeader
  number="02"
  label="Work"
  title="Featured Projects"
  subtitle="Here are some of my recent projects that showcase my skills in machine learning and full-stack development."
/>
```

- [ ] **Step 2: Upgrade cards to `glass-panel` in `Projects.module.css`**

Find the `.card` rule and replace its background/border/shadow with:

```css
.card {
  background: var(--glass-panel-bg);
  border: 1px solid var(--glass-panel-border);
  backdrop-filter: var(--glass-panel-blur);
  -webkit-backdrop-filter: var(--glass-panel-blur);
  box-shadow: var(--glass-panel-highlight), var(--glass-panel-shadow);
  border-radius: 14px;
  padding: 28px;
  transition: all var(--duration-base) var(--ease-out-smooth);
  height: 100%;
}

.card:hover {
  background: var(--glass-elevated-bg);
  border-color: var(--glass-elevated-border);
  transform: translateY(-4px);
}
```

Find `.techItem` (the small tag pills) and upgrade:
```css
.techItem {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: "DM Mono", monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: var(--glass-subtle-bg);
  border: 1px solid var(--glass-subtle-border);
  color: rgba(255, 255, 255, 0.62);
}
```

Delete the old `.header`, `.sectionNumber`, `.title`, `.line`, `.subtitle` rules — now provided by `SectionHeader`.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/public/Projects
git commit -m "feat(projects): use SectionHeader, upgrade cards + tags to new glass tiers"
```

---

### Task 11: Refine Experience section

**Files:**
- Modify: `src/components/public/Experience/Experience.tsx`
- Modify: `src/components/public/Experience/Experience.module.css`

- [ ] **Step 1: Read current Experience structure**

Run:
```bash
npx tsc --noEmit && cat "src/components/public/Experience/Experience.tsx" | head -120
```

(This is a read step — record where the section header block appears.)

- [ ] **Step 2: Swap inline header for `<SectionHeader number="03" label="Experience" title="Where I've worked" />`**

Add `import SectionHeader from "@/components/public/SectionHeader";` to the top of `Experience.tsx`. Replace the existing header JSX block (the block containing `03.`, a title, and the animated `.line`) with a single `<SectionHeader ... />` call. Use number `"03"` and label `"Experience"`.

- [ ] **Step 3: Upgrade role/timeline cards in `Experience.module.css`**

Find the class used for each role card (commonly `.card` or `.item`). Replace its background/border/shadow with the `glass-panel` tier:

```css
.card {
  background: var(--glass-panel-bg);
  border: 1px solid var(--glass-panel-border);
  backdrop-filter: var(--glass-panel-blur);
  -webkit-backdrop-filter: var(--glass-panel-blur);
  box-shadow: var(--glass-panel-highlight), var(--glass-panel-shadow);
  border-radius: 14px;
  padding: 28px;
  transition: all var(--duration-base) var(--ease-out-smooth);
}

.card:hover {
  background: var(--glass-elevated-bg);
  border-color: var(--glass-elevated-border);
  transform: translateY(-3px);
}
```

If the existing file uses a different class name, apply the same rule set to that class. Delete the old `.header`, `.sectionNumber`, `.title`, `.line`, `.subtitle` rules.

If a timeline element exists, refine its line to a gradient:
```css
.timelineLine {
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.18), transparent);
}
```
And dots:
```css
.timelineDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--glass-elevated-bg);
  border: 1px solid var(--glass-elevated-border);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/public/Experience
git commit -m "feat(experience): use SectionHeader, upgrade cards + timeline hairline"
```

---

### Task 12: Refine Skills section (remove Skills3DElement)

**Files:**
- Modify: `src/components/public/Skills/Skills.tsx`
- Modify: `src/components/public/Skills/Skills.module.css`

- [ ] **Step 1: Remove `Skills3DElement` import + render + swap inline header**

In `Skills.tsx`:
- Remove any `import { Skills3DElement } from "@/components/3d/Scene3D";` or the dynamic import wrapper.
- Remove the `<Skills3DElement />` JSX and any wrapping `<div>` whose only purpose was to host it.
- Add `import SectionHeader from "@/components/public/SectionHeader";`.
- Replace the existing inline header block with: `<SectionHeader number="04" label="Skills" title="What I work with" />`.

- [ ] **Step 2: Upgrade skill cards in `Skills.module.css`**

Apply `glass-panel` tier to the skill-group cards:

```css
.skillGroup {
  background: var(--glass-panel-bg);
  border: 1px solid var(--glass-panel-border);
  backdrop-filter: var(--glass-panel-blur);
  -webkit-backdrop-filter: var(--glass-panel-blur);
  box-shadow: var(--glass-panel-highlight), var(--glass-panel-shadow);
  border-radius: 14px;
  padding: 28px;
  transition: all var(--duration-base) var(--ease-out-smooth);
}

.skillGroup:hover {
  background: var(--glass-elevated-bg);
  border-color: var(--glass-elevated-border);
  transform: translateY(-3px);
}
```

If the file uses a different class name for the cards, apply to that class.

Delete the old `.header`, `.sectionNumber`, `.title`, `.line` rules. Delete any rules targeting the removed 3D element (`.skills3d`, `.element3d`, etc).

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/public/Skills
git commit -m "feat(skills): remove 3D element, use SectionHeader, upgrade cards"
```

---

### Task 13: Refine Contact section

**Files:**
- Modify: `src/components/public/Contact/Contact.tsx`
- Modify: `src/components/public/Contact/Contact.module.css`

- [ ] **Step 1: Swap inline header for `<SectionHeader />`**

In `Contact.tsx`:
- Add `import SectionHeader from "@/components/public/SectionHeader";`.
- Replace inline header with: `<SectionHeader number="05" label="Contact" title="Let's build something" subtitle="Have a project in mind? Send a message." />`.

- [ ] **Step 2: Upgrade inputs and form container in `Contact.module.css`**

For the text inputs / textarea:
```css
.input,
.textarea {
  width: 100%;
  padding: 14px 16px;
  font-family: "Outfit", sans-serif;
  font-size: 0.9375rem;
  color: #ffffff;
  background: var(--glass-subtle-bg);
  border: 1px solid var(--glass-subtle-border);
  backdrop-filter: var(--glass-subtle-blur);
  -webkit-backdrop-filter: var(--glass-subtle-blur);
  border-radius: 10px;
  transition: all var(--duration-base) var(--ease-out-smooth);
  outline: none;
}

.input::placeholder,
.textarea::placeholder {
  color: rgba(255, 255, 255, 0.32);
}

.input:focus,
.textarea:focus {
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

For the form wrapper (if there's a `.form` or similar container), upgrade to `glass-panel` tier as in Projects.

Delete old `.header`, `.sectionNumber`, `.title`, `.line`, `.subtitle` rules.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/components/public/Contact
git commit -m "feat(contact): use SectionHeader, refine inputs with glass-subtle tier"
```

---

### Task 14: Refine Header (navbar)

**Files:**
- Modify: `src/components/public/Header/Header.tsx`
- Modify: `src/components/public/Header/Header.module.css`

- [ ] **Step 1: Read current Header.tsx structure**

Before editing, read the file to find the outer nav element class. The scroll-to-pill behavior wraps the outer `<nav>` or `<header>` with `motion.nav` and drives its `max-width` + `borderRadius` via `useScroll`.

- [ ] **Step 2: Add scroll-to-pill behavior**

At the top of `Header.tsx` (inside the component, before the return), add:

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
// ...
const { scrollY } = useScroll();
const maxWidth = useTransform(scrollY, [0, 120], ["100%", "720px"]);
const borderRadius = useTransform(scrollY, [0, 120], [0, 999]);
const marginTop = useTransform(scrollY, [0, 120], [0, 12]);
```

Wrap the outer `<header>` or nav container with `motion.div`/`motion.header` and apply `style={{ maxWidth, borderRadius, marginTop, marginLeft: "auto", marginRight: "auto" }}`. If the existing element is already a `motion.header`, just add the style.

- [ ] **Step 3: Apply `glass-elevated` tier in `Header.module.css`**

Find the outer container rule (commonly `.header` or `.nav`) and replace its background/blur with:
```css
.header {
  background: var(--glass-elevated-bg);
  border: 1px solid var(--glass-elevated-border);
  backdrop-filter: var(--glass-elevated-blur);
  -webkit-backdrop-filter: var(--glass-elevated-blur);
  box-shadow: var(--glass-elevated-highlight), var(--glass-elevated-shadow);
  transition: all var(--duration-base) var(--ease-out-smooth);
  /* keep existing layout rules (display, padding, etc) */
}
```

For active nav link, add a 1px underline on hover / active:
```css
.navLink {
  position: relative;
  /* existing rules */
}
.navLink::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: #ffffff;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-base) var(--ease-out-smooth);
}
.navLink:hover::after,
.navLink.active::after {
  transform: scaleX(1);
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/public/Header
git commit -m "feat(header): glass-elevated pill with scroll-collapse animation"
```

---

### Task 15: Refine Footer

**Files:**
- Modify: `src/components/public/Footer/Footer.module.css`

- [ ] **Step 1: Minimal footer styling**

Replace the existing outer footer style block with:

```css
.footer {
  background: #000;
  padding: 48px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.container {
  max-width: var(--section-max-width);
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    text-align: center;
  }
}
```

If the existing file has many more rules (logo styles, link styles), leave those intact. Only the outer container + padding changes.

- [ ] **Step 2: Verify**

```bash
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/components/public/Footer
git commit -m "feat(footer): minimal pure-black with hairline top divider"
```

---

### Task 16: Reduce MagneticButton default strength

**Files:**
- Modify: `src/components/animations/MagneticButton.tsx`

- [ ] **Step 1: Change default**

Open `src/components/animations/MagneticButton.tsx`. Find the component signature (likely `export default function MagneticButton({ children, strength = 0.4 }: ...)`) and change `0.4` to `0.25`.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/MagneticButton.tsx
git commit -m "feat(animations): reduce default magnetic strength 0.4 → 0.25"
```

---

### Task 17: Wire ScrollProgress + SectionDividers in page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update `page.tsx`**

Replace the file contents with:

```tsx
'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Projects from '@/components/public/Projects';
import Experience from '@/components/public/Experience';
import Skills from '@/components/public/Skills';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import SectionDivider from '@/components/public/SectionDivider';
import ScrollProgress from '@/components/animations/ScrollProgress';

const LoadingWrapper = dynamic(
  () => import('@/components/3d/LoadingScreen').then(mod => ({ default: mod.LoadingWrapper })),
  { ssr: false }
);

export default function Home() {
  return (
    <LoadingWrapper>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <About />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </LoadingWrapper>
  );
}
```

Note: no divider between Hero and About — Spline's fade-to-black vignette handles that transition.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(page): mount ScrollProgress + SectionDividers between sections"
```

---

### Task 18: Clean up unused 3D exports

**Files:**
- Modify: `src/components/3d/Scene3D.tsx`
- Modify: `src/components/3d/index.ts`

- [ ] **Step 1: Verify no one imports the removed scenes**

```bash
grep -rn "About3DScene\|Skills3DElement\|Hero3DScene" src/
```

Expected: only references inside `Scene3D.tsx` itself (now that Hero no longer imports `Hero3DScene`, Skills no longer imports `Skills3DElement`, About never imported anything 3D).

If any references outside `Scene3D.tsx` remain, fix them first (they should have been fixed in tasks 8, 9, 12 already).

- [ ] **Step 2: Delete the unused exports in `Scene3D.tsx`**

Open `src/components/3d/Scene3D.tsx`. Delete the `export` keyword from `Hero3DScene`, `About3DScene`, and `Skills3DElement` — OR delete the entire components + their helper functions that are now unused (`OrbitalRings`, `GridFloor`, `HeroSceneContent`, `AboutSceneContent`, `SkillsSceneContent`, `FallbackBackground`, `FrameLimiter`, `useAdaptivePerformance`, `themeColors`).

Preferred: delete the whole file. Replace `src/components/3d/Scene3D.tsx` with:

```tsx
// Intentionally left blank — R3F hero/about/skills scenes removed in favor of Spline.
// Kept as an empty module to avoid breaking any lingering imports until cleanup.
export {};
```

Actually, since we've verified no one imports from it, delete the file entirely:
```bash
rm src/components/3d/Scene3D.tsx
```

- [ ] **Step 3: Update `src/components/3d/index.ts`**

Open `src/components/3d/index.ts` and remove any line that exports from `./Scene3D`. Keep exports of `LoadingScreen` and `InteractiveElements`.

- [ ] **Step 4: Verify no regressions**

```bash
npx tsc --noEmit
npm run lint
```

Expected: clean. If TypeScript complains about missing modules, a component still imports from `Scene3D` — fix that import.

- [ ] **Step 5: Commit**

```bash
git add src/components/3d
git commit -m "chore(3d): remove unused R3F hero/about/skills scenes"
```

---

### Task 19: Final verification pass

**Files:** none — pure verification.

- [ ] **Step 1: Type check**

```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: zero errors (warnings acceptable).

- [ ] **Step 3: Production build**

```bash
npm run build
```
Expected: build completes. A Three.js-dedup warning from Spline is acceptable. No build-breaking errors.

- [ ] **Step 4: Dev smoke test**

```bash
npm run dev
```
Open `http://localhost:3000` and confirm each item:

- [ ] Spline scene loads within ~10s, animates continuously.
- [ ] Hero text readable over Spline, no photo visible, centered.
- [ ] Scroll wheel works when cursor is over the Spline canvas (pointer-events disabled on canvas).
- [ ] `View My Work` button scrolls to projects; `Get In Touch` scrolls to contact.
- [ ] Fade-to-black into About is seamless (no visible seam).
- [ ] About shows `01 — About` eyebrow, expanding line animates on view.
- [ ] About photo frame has the new glass-elevated look, floats gently.
- [ ] Projects shows `02 — Work` eyebrow, cards lift + change tier on hover.
- [ ] Experience shows `03 — Experience` eyebrow, cards lift on hover.
- [ ] Skills shows `04 — Skills` eyebrow, no R3F canvas visible anywhere.
- [ ] Contact shows `05 — Contact` eyebrow, inputs have glass-subtle look, focus ring appears on click.
- [ ] Header floats, collapses to pill after ~120px scroll.
- [ ] Scroll progress bar at top fills as page scrolls (visible with `mix-blend-mode: difference`).
- [ ] Footer is minimal pure black with hairline top.
- [ ] `SectionDivider` visible between About/Projects, Projects/Experience, Experience/Skills, Skills/Contact. No divider between Hero/About.
- [ ] Open DevTools console — no errors. Warnings acceptable.

- [ ] **Step 5: Mobile viewport (375px) smoke test**

Using DevTools responsive mode at 375×812:

- [ ] Hero stacks, Spline still renders, text still centered.
- [ ] No horizontal scroll on any section.
- [ ] About stacks with photo above text (or as mobile layout dictates).
- [ ] Projects / Experience / Skills stack to single column.
- [ ] Header still functional (collapses/doesn't depending on implementation).

- [ ] **Step 6: Admin unaffected**

Navigate to `/admin/login` — confirm it renders without errors and looks identical to before.

- [ ] **Step 7: Reduced-motion test**

In DevTools → Rendering → Emulate CSS media `prefers-reduced-motion: reduce`. Refresh. Confirm eyebrow lines don't animate, RevealText words appear without the stagger transform.

- [ ] **Step 8: Final commit (if anything was tweaked during verification)**

If you made any fix-up commits during verification, nothing to do. If all passed first-try, this step is a no-op.

---

## Out of Scope (explicit non-goals)

- Lighthouse performance audits, LCP/CLS tuning
- Production deploy to Vercel / prod environment
- Actual email delivery verification on Contact form
- SEO regression testing
- Admin UI redesign
- Database schema changes
- `CursorTrailer`, `TiltCard`, `ParallaxSection`, `AnimatedCounter`, `FloatingElement` refactors (kept as-is; `FloatingElement` still used by About photo)

---

## Self-Review

Performed against the spec `docs/superpowers/specs/2026-04-24-portfolio-premium-redesign-design.md`:

**Spec coverage:**
- Section 3 (architecture/new components) → Tasks 3, 4, 5, 6, 7 ✔
- Section 4 (tokens) → Task 2 ✔
- Section 5 (SplineHero) → Task 7 ✔
- Section 6.1 (Hero) → Task 8 ✔
- Section 6.2 (About) → Task 9 ✔
- Section 6.3 (Projects) → Task 10 ✔ (thumbnail grayscale hover intentionally dropped — projects use folder icons, not images)
- Section 6.4 (Experience) → Task 11 ✔
- Section 6.5 (Skills) → Task 12 ✔
- Section 6.6 (Contact) → Task 13 ✔
- Section 6.7 (Header) → Task 14 ✔
- Section 6.8 (Footer) → Task 15 ✔
- Section 6.9 (page.tsx) → Task 17 ✔
- Section 7 (motion — ScrollProgress, RevealText, eyebrow line, magnetic 0.25) → Tasks 3, 4, 5, 16 ✔
- Section 8 (verification) → Task 19 ✔
- Section 9 (risks — pointer-events on canvas, etc) → addressed inline in Task 7 CSS ✔

**Placeholder scan:** No "TBD", "TODO", "implement later" found. All code blocks contain actual code.

**Type consistency:** `SectionHeader` props (`number`, `label`, `title`, `subtitle`) match across all consumer tasks (9–13). `SplineHero` has no props. `ScrollProgress` has no props. `RevealText` props (`text`, `as`, `className`, `stagger`, `delay`) are self-contained.

**Gap check:** none.

---

**Plan complete. Proceed to subagent-driven-development to execute task-by-task.**
