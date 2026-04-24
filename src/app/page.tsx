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

// Dynamic import for loading wrapper (client-side only with 3D)
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
