import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import CursorTrailer from "@/components/animations/CursorTrailer";

export const metadata: Metadata = {
  title: "Gurusewak | AI/ML Engineer",
  description: "Portfolio of Gurusewak - A passionate AI/ML Engineer building intelligent systems.",
  keywords: ["ML Engineer", "Full Stack Developer", "Machine Learning", "React", "Next.js", "Python", "TensorFlow"],
  authors: [{ name: "Gurusewak Singh" }],
  openGraph: {
    title: "Gurusewak | AI/ML Engineer",
    description: "Portfolio of Gurusewak - A passionate AI/ML Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <CursorTrailer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
