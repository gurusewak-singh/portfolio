# Portfolio Premium Redesign — Design Spec

**Date:** 2026-04-24
**Owner:** Gurusewak
**Scope:** Public-facing design refresh + Spline 3D hero integration. Admin, API, auth, and data layer untouched.

---

## 1. Goals

Transform the existing portfolio from "good dark theme" to a **premium editorial black finish** with:

1. A full-bleed Spline 3D hero background replacing the current R3F grid.
2. A consistent three-tier glassmorphism system across every public section.
3. Editorial typographic rhythm (numbered section eyebrows, display headings, 160px section rhythm, hairline dividers).
4. Refined motion (scroll progress bar, word-by-word title reveals, tightened magnetic pull).
5. Pure monochrome — no accent color, no grain texture.

**Non-goals:** admin UI changes, CMS/DB changes, API changes, dark-mode toggle, i18n, routing, new pages, performance optimization beyond what falls out of the design.

---

## 2. User-Confirmed Decisions

| Decision point | Choice |
|---|---|
| Spline placement | **A** — Replace Hero background full-bleed |
| Hero composition | **B** — Drop Hero photo, center text, Spline is the visual |
| About photo handling | Photo moves to About right column |
| R3F scenes | **D** — Remove `About3DScene` + `Skills3DElement`, Spline is the only 3D |
| Mobile Spline behavior | **A1** — Load everywhere, accept 3–5s mobile render |
| Accent finish | **B1** — Pure monochrome, no color accent, no grain |
| Approach | **2** — Editorial Restructure |
| Execution mode | Autonomous — make judgment calls, don't ask permission for sub-decisions |

---

## 3. Architecture & Scope

### New dependencies

- `@splinetool/react-spline`
- `@splinetool/runtime`

Installed via `npm install`. Both are required for `import Spline from '@splinetool/react-spline/next'`.

### New components

| Path | Responsibility |
|---|---|
| `src/components/public/SplineHero/SplineHero.tsx` | Wraps `<Spline>` with dynamic import, Suspense, load-state opacity fade, pointer-events disabled, fade-to-black vignette |
| `src/components/public/SplineHero/SplineHero.module.css` | Stage, vignette, skeleton backdrop styles |
| `src/components/public/SectionHeader/SectionHeader.tsx` | Props: `number` (string, e.g. "01"), `label` (eyebrow text, e.g. "About"), `title` (display heading), `subtitle` (optional). Renders numbered eyebrow + animated expanding line + display title (wrapped in `RevealText`) + optional subtitle. Used by About, Projects, Experience, Skills, Contact |
| `src/components/public/SectionHeader/SectionHeader.module.css` | Eyebrow line-expand animation, typography |
| `src/components/animations/ScrollProgress.tsx` | 1px top-pinned progress bar driven by `useScroll` + `useSpring`, `mix-blend-mode: difference` |
| `src/components/animations/RevealText.tsx` | Word-by-word masked reveal using `whileInView` + stagger |

### Modified files

| Path | Change |
|---|---|
| `package.json` / `package-lock.json` | Add Spline deps |
| `src/app/globals.css` | Add three-tier glass tokens, motion tokens, refined type scale, spacing rhythm tokens |
| `src/app/page.tsx` | Mount `<ScrollProgress />` at top level; add `<div className="sectionDivider" />` between public sections |
| `src/components/public/Hero/Hero.tsx` | Remove photo, rotating blob, R3F background, two-column grid. Single centered column. `<SplineHero />` as background |
| `src/components/public/Hero/Hero.module.css` | Center layout, drop image/decoration styles, keep typing/scroll-indicator styles |
| `src/components/public/About/About.tsx` | Remove `About3DScene`. Add photo (from Hero) in `glass-elevated` frame on right. Add `SectionHeader` |
| `src/components/public/About/About.module.css` | Replace 3D column styling with `.photoFrame` |
| `src/components/public/Skills/Skills.tsx` | Remove `Skills3DElement`. Add `SectionHeader`. Apply `glass-panel` to skill cards |
| `src/components/public/Skills/Skills.module.css` | Remove 3D overlay styles |
| `src/components/public/Projects/Projects.tsx` + CSS | Add `SectionHeader`. Upgrade cards to `glass-panel`, hover → `glass-elevated`. Thumbnail `mix-blend-mode: luminosity` default, removed on hover |
| `src/components/public/Experience/Experience.tsx` + CSS | Add `SectionHeader`. Hairline timeline with gradient 1px line + 6px glass dots. Cards → `glass-panel` |
| `src/components/public/Contact/Contact.tsx` + CSS | Add `SectionHeader`. Inputs → `glass-subtle` with refined focus ring |
| `src/components/public/Header/Header.tsx` + CSS | `glass-elevated` tier. Scroll-collapse into centered pill (max-width 720px, border-radius 999px) via Framer Motion |
| `src/components/public/Footer/Footer.tsx` + CSS | Minimal: 48px padding, hairline top divider, no glass |

### Deleted / unused

`src/components/3d/Scene3D.tsx` — `Hero3DScene`, `About3DScene`, `Skills3DElement` exports become unused. Remove them. Keep `LoadingScreen` and `InteractiveElements` intact (out of scope).

### Untouched

- All of `src/app/admin/**`
- All of `src/app/api/**`
- `src/models/**`
- `src/lib/**`
- `src/context/**` (ThemeContext, PreloadedAssetsContext)
- `src/app/layout.tsx`, `sitemap.ts`, `opengraph-image.tsx`
- `src/components/3d/LoadingScreen.tsx`, `InteractiveElements.tsx`
- `src/components/animations/` — existing components unchanged: `AnimatedCounter`, `CursorTrailer`, `FloatingElement`, `MagneticButton`, `ParallaxSection`, `ScrollReveal`, `TiltCard`

---

## 4. Design Token System (`globals.css`)

### Three-tier glass

```css
:root {
  /* Subtle — tags, ambient chips */
  --glass-subtle-bg: rgba(255, 255, 255, 0.028);
  --glass-subtle-border: rgba(255, 255, 255, 0.06);
  --glass-subtle-blur: blur(16px) saturate(150%);

  /* Panel — primary cards (projects, experience, skills, contact form) */
  --glass-panel-bg: rgba(255, 255, 255, 0.045);
  --glass-panel-border: rgba(255, 255, 255, 0.09);
  --glass-panel-blur: blur(32px) saturate(200%);
  --glass-panel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  --glass-panel-shadow:
    0 1px 0 rgba(0, 0, 0, 0.4),
    0 24px 48px -12px rgba(0, 0, 0, 0.6);

  /* Elevated — navbar pill, About photo frame, hover state */
  --glass-elevated-bg: rgba(255, 255, 255, 0.07);
  --glass-elevated-border: rgba(255, 255, 255, 0.14);
  --glass-elevated-blur: blur(48px) saturate(200%);
  --glass-elevated-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  --glass-elevated-shadow:
    0 1px 0 rgba(0, 0, 0, 0.4),
    0 40px 80px -20px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

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

### Type scale

| Token | Value |
|---|---|
| Hero name | `font-size: clamp(3.25rem, 9vw, 7rem); letter-spacing: -0.05em; line-height: 0.95;` |
| Section display title | `font-size: clamp(2.25rem, 5vw, 3.25rem); letter-spacing: -0.03em; line-height: 1;` |
| Section eyebrow | `font-family: "DM Mono"; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.38);` |
| Body | unchanged (1.0625rem / 1.6) |
| Mono labels | `font-size: 0.6875rem; letter-spacing: 0.16em;` |

### Spacing / rhythm

```css
--section-padding-y: 160px;
--section-padding-y-mobile: 96px;
--section-max-width: 1200px;
--section-divider: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
```

### Motion tokens

```css
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
--ease-out-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--duration-fast: 200ms;
--duration-base: 400ms;
--duration-slow: 800ms;
```

### Preserved

Existing `--bg-*`, `--text-*`, `--accent-*`, `--success/error/warning` tokens. Font imports (Syne/Outfit/DM Mono). Base body styles, scrollbar, selection, focus ring. Existing `@keyframes` and `.animate-*` utilities.

---

## 5. SplineHero Component Spec

```tsx
// src/components/public/SplineHero/SplineHero.tsx
'use client';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import styles from './SplineHero.module.css';

const Spline = dynamic(
  () => import('@splinetool/react-spline/next'),
  { ssr: false, loading: () => null }
);

const SCENE_URL = 'https://prod.spline.design/uyjjdqlPYik3EmHd/scene.splinecode';

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

### Styling

```css
.stage {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.skeleton {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.035), transparent),
    #000;
  transition: opacity 600ms var(--ease-out-smooth);
}

.sceneWrap {
  position: absolute;
  inset: 0;
  transition: opacity 800ms var(--ease-out-smooth);
}

.sceneWrap :global(canvas) {
  pointer-events: none;
}

.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%),
    linear-gradient(to bottom, transparent 65%, #000 100%);
}
```

### Error handling

- Dynamic import fails → `loaded` stays `false`, skeleton backdrop remains visible forever. No crash. Hero text still readable.
- `onError` on `<Spline>` → log in dev, silently degrade in prod (same behavior — skeleton stays).
- No WebGL capability check at this layer (Spline runtime handles it).

---

## 6. Section-by-Section Rework

### 6.1 Hero

**Layout:** single centered column, no photo, no right image wrapper.

```
.hero (relative, min-height: 100vh, overflow: hidden, bg: #000)
├── <SplineHero />  (absolute, z:1)
└── .container (relative, z:3, max-width: 760px, centered, text-align: center)
    ├── eyebrow "HELLO, I'M"
    ├── name "Gurusewak" (7rem display)
    ├── typing role
    ├── description (max-width: 520px)
    ├── actions (View Work / Get In Touch)
    ├── hairline divider
    └── social icons row
```

**Removed:** `Hero3DScene` import, `heroBackground` image layer, `heroOverlay`, `imageWrapper`, `imageContainer`, `heroPhotoWrapper`, `imageDecoration`, `FloatingElement` wrapper around photo, `PreloadedAssetsContext.heroPhoto` usage in Hero (moves to About).

**Preserved:** typing animation logic, magnetic buttons, scroll indicator, social array.

### 6.2 About

**Layout:** Two-column grid, eyebrow + title + body on left, photo on right. Stacks to photo-top / text-bottom on mobile.

**Photo frame:**
```css
.photoFrame {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 18px;
  overflow: hidden;
  /* glass-elevated tier applied */
}
.photoFrame::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  box-shadow: var(--glass-elevated-highlight);
  pointer-events: none;
}
```

Wrapped in `<FloatingElement duration={6} yOffset={8} rotateAmount={0}>` for idle float.

**Removed:** `About3DScene` + its Canvas column.

### 6.3 Projects

- `SectionHeader` with `number="02"` and `label="Work"`.
- Cards: `glass-panel` default → `glass-elevated` on hover, `translateY(-4px)`, transition `var(--duration-base) var(--ease-out-smooth)`.
- Thumbnails: `filter: grayscale(1) contrast(1.05);` default, `filter: grayscale(0) contrast(1);` on hover (simpler and more reliable than `mix-blend-mode` across browsers — correction during design review).
- Tech tags: `glass-subtle`, mono 0.16em tracking.

### 6.4 Experience

- `SectionHeader` with `number="03"` and `label="Experience"`.
- Timeline: `::before` 1px gradient line on the left column of each row, 6px glass dot markers.
- Role cards: `glass-panel`.

### 6.5 Skills

- `SectionHeader` with `number="04"` and `label="Skills"`.
- Remove `Skills3DElement` canvas overlay.
- Grid of `glass-panel` cards, 3 columns desktop / 1 mobile.

### 6.6 Contact

- `SectionHeader` with `number="05"` and `label="Contact"`.
- Inputs use `glass-subtle`; focus border `rgba(255,255,255,0.28)` + inner highlight.
- Form submit logic and `/api/contact` call unchanged.

### 6.7 Header

- `glass-elevated` tier.
- Scroll behavior: once `scrollY > 80`, animate `max-width: 100% → 720px`, `border-radius: 0 → 999px`, `margin-top: 0 → 12px`. Uses Framer Motion's `useScroll` + `useTransform`.
- Active nav link gets 1px animated underline.

### 6.8 Footer

- Pure black, no glass. 48px vertical padding. Hairline top divider. Left: name + year. Right: social links (icon-only, mono labels).

### 6.9 page.tsx

```tsx
<LoadingWrapper>
  <ScrollProgress />
  <Header />
  <main>
    <Hero />
    <SectionDivider />
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
```

`<SectionDivider />` is a simple inline component that renders `<div className={styles.divider} />` with 1px height and the `--section-divider` gradient. No divider between Hero → About (Spline vignette handles the transition).

---

## 7. Motion System

| Element | Behavior |
|---|---|
| `ScrollProgress` | 1px bar, top: 0, width: 100%, `mix-blend-mode: difference`, scaleX driven by `useSpring(useScroll().scrollYProgress, { stiffness: 120, damping: 30 })` |
| `RevealText` (section titles, Hero name) | Each word in `<span>` with `overflow: hidden`; inner span `y: 100% → 0`, 40ms stagger, 800ms duration, `ease-out-expo`. Triggered once via `whileInView` |
| `SectionHeader` eyebrow line | `width: 0 → 24px` next to the number on first view, 600ms, `ease-out-expo` |
| `MagneticButton` default strength | 0.4 → 0.25 (file-level default change) |
| `FloatingElement` on About photo | `duration: 6s`, `yOffset: 8`, `rotateAmount: 0` (no rotation for editorial feel) |

All motion gated behind `prefers-reduced-motion: reduce` via existing globals.css rule.

---

## 8. Verification Plan

Executed in order, each step a gate before claiming done:

1. **Install** — `npm install @splinetool/react-spline @splinetool/runtime`. Zero peer-dep errors.
2. **Type check** — `npx tsc --noEmit` clean.
3. **Lint** — `npm run lint` clean.
4. **Build** — `npm run build` clean. Watch for: Three.js dedup warnings (acceptable), dynamic-import SSR warnings (should be none since both R3F and Spline are `ssr: false`).
5. **Dev smoke test** — `npm run dev`, visit `http://localhost:3000`:
   - Spline scene loads within ~10s, animates.
   - Hero text readable over scene, buttons clickable, scroll works through Spline canvas.
   - Fade-to-black into About is seamless.
   - About photo renders in glass frame.
   - Each section shows its numbered eyebrow with expanding line.
   - Project cards lift on hover; grayscale → color thumbnail transition works.
   - Experience timeline renders with dots + hairline.
   - Skills cards render in grid without the removed 3D canvas.
   - Contact form renders with glass inputs; submit triggers network call.
   - Scroll progress bar fills as page scrolls.
   - Header collapses to pill after 80px scroll.
   - No console errors (warnings OK).
6. **Mobile 375px viewport** in DevTools:
   - Hero stacks, Spline visible, text centered.
   - About stacks (photo on top).
   - No horizontal overflow on any section.
7. **Admin smoke test** — `/admin` routes render identically (no visual diff).
8. **Reduced motion** — toggle `prefers-reduced-motion: reduce`, confirm reveals/floats shorten.

Explicitly out of scope: Lighthouse scores, deploy to prod, actual email delivery, SEO regression testing.

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Spline scene blocks interaction | `pointer-events: none` on `.stage` + on the internal canvas via `:global(canvas)` selector |
| Spline runtime bundles its own Three.js (duplicate Three) | Acceptable — our own Three usage is being removed. If bundle size becomes a concern later, investigate then |
| `@splinetool/react-spline/next` requires specific Next.js version | Project is on Next 16, which is supported |
| Mobile devices hit 3–5s load | Accepted per A1 decision. Skeleton backdrop prevents empty-state flash |
| Scroll progress bar invisible on white-ish sections | `mix-blend-mode: difference` ensures contrast on any background |
| `backdrop-filter` performance on low-end devices | Tradeoff accepted for premium feel; Safari/Chrome/Firefox all support it |
| Removing `About3DScene` / `Skills3DElement` breaks other imports | Grep for usages before removing; remove imports in the consuming files |

---

## 10. Open Questions

None. User has explicitly authorized autonomous execution — any remaining micro-decisions (exact padding values, hover transition durations, which social icon set, etc.) will be made using the tokens above as ground truth.

---

**Design approved by user on 2026-04-24. Proceed to writing-plans for implementation breakdown, then execute.**
