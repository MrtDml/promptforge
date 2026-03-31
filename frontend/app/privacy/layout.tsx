import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Prompt Forge",
  description: "Prompt Forge Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and applicable regulations.",
  alternates: { canonical: "https://promptforgeai.dev/privacy" },
  openGraph: {
    title: "Privacy Policy – Prompt Forge",
    description: "Learn how Prompt Forge collects, uses, and protects your personal data.",
    url: "https://promptforgeai.dev/privacy",
    siteName: "Prompt Forge",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prompt Forge Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy – Prompt Forge",
    description: "Learn how Prompt Forge collects, uses, and protects your personal data.",
    images: ["/twitter-image"],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
