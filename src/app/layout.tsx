import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gurusewak.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Gurusewak | AI/ML Engineer",
  description:
    "Portfolio of Gurusewak — AI/ML Engineer building production-grade intelligent systems and scalable backend applications.",
  keywords: [
    "ML Engineer",
    "AI Engineer",
    "Full Stack Developer",
    "Machine Learning",
    "Generative AI",
    "RAG",
    "Next.js",
    "Python",
    "PyTorch",
  ],
  authors: [{ name: "Gurusewak Singh" }],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Gurusewak | AI/ML Engineer",
    description:
      "Portfolio of Gurusewak — AI/ML Engineer building production-grade intelligent systems.",
    type: "website",
    url: siteUrl,
    siteName: "Gurusewak.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gurusewak | AI/ML Engineer",
    description:
      "Portfolio of Gurusewak — AI/ML Engineer building production-grade intelligent systems.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
