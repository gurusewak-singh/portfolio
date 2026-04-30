import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gurusewak.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gurusewak Singh — AI/ML Engineer",
    template: "%s · Gurusewak Singh",
  },
  description:
    "Gurusewak Singh — AI/ML Engineer building production-ready intelligent systems, RAG pipelines, and high-performance APIs. Portfolio, projects, and research.",
  keywords: [
    "Gurusewak",
    "Gurusewak Singh",
    "Gurusewak portfolio",
    "Gurusewak AI Engineer",
    "Gurusewak ML Engineer",
    "AI ML Engineer India",
    "Machine Learning Engineer portfolio",
    "Generative AI Engineer",
    "RAG Engineer",
    "FastAPI Python Backend",
    "Next.js portfolio",
  ],
  authors: [{ name: "Gurusewak Singh", url: siteUrl }],
  creator: "Gurusewak Singh",
  publisher: "Gurusewak Singh",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Gurusewak Singh — AI/ML Engineer",
    description:
      "AI/ML Engineer building production-ready intelligent systems, RAG pipelines, and high-performance APIs.",
    type: "profile",
    url: siteUrl,
    siteName: "Gurusewak.in",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gurusewak Singh — AI/ML Engineer",
    description:
      "AI/ML Engineer building production-ready intelligent systems, RAG pipelines, and high-performance APIs.",
    creator: "@iamguruuu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

// JSON-LD structured data — tells Google this site represents a
// specific person, an AI/ML Engineer, with named accounts on other
// platforms. Google uses this to:
//   1. Build a Knowledge Graph entity for "Gurusewak Singh"
//   2. Disambiguate from the unrelated 'Gurusewak Exhaust' business
//   3. Surface a rich Knowledge Panel on personal-name queries
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gurusewak Singh",
  alternateName: ["Gurusewak", "Guru"],
  url: siteUrl,
  jobTitle: "AI/ML Engineer",
  description:
    "AI/ML Engineer specialised in production-ready intelligent systems, retrieval-augmented generation (RAG), and high-performance backend APIs.",
  knowsAbout: [
    "Machine Learning",
    "Generative AI",
    "Retrieval-Augmented Generation",
    "Large Language Models",
    "Python",
    "PyTorch",
    "TensorFlow",
    "FastAPI",
    "Next.js",
    "PostgreSQL",
  ],
  sameAs: [
    "https://github.com/gurusewak-singh",
    "https://linkedin.com/in/gurusewak122",
    "https://twitter.com/iamguruuu",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gurusewak.in",
  url: siteUrl,
  inLanguage: "en",
  author: { "@type": "Person", name: "Gurusewak Singh" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, websiteSchema]),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
