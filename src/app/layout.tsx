import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Gurusewak | AI/ML Engineer",
  description: "Portfolio of Gurusewak - A passionate AI/ML Engineer building intelligent systems.",
  keywords: ["ML Engineer", "Full Stack Developer", "Machine Learning", "React", "Next.js", "Python", "TensorFlow"],
  authors: [{ name: "Gurusewak Singh" }],
  openGraph: {
    title: "Gurusewak | AI/ML Engineer",
    description: "Portfolio of Gurusewak - A passionate AI/ML Engineer building intelligent systems",
    type: "website",
    siteName: "Gurusewak.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gurusewak | AI/ML Engineer",
    description: "Portfolio of Gurusewak - A passionate AI/ML Engineer building intelligent systems",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Start the 1.3 MB Spline scene download as early as possible —
            in parallel with HTML parse + React hydration, instead of
            waiting for SplineHero to mount and trigger the fetch. */}
        <link
          rel="preload"
          href="/scene.splinecode"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
