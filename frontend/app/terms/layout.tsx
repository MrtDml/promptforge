import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Prompt Forge",
  description: "Prompt Forge Terms of Service. Read our terms and conditions before using the platform.",
  keywords: ["prompt forge terms", "promptforge terms of service", "AI SaaS builder terms"],
  alternates: { canonical: "https://promptforgeai.dev/terms" },
  openGraph: {
    title: "Terms of Service – Prompt Forge",
    description: "Read the Prompt Forge Terms of Service before using the platform.",
    url: "https://promptforgeai.dev/terms",
    siteName: "Prompt Forge",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prompt Forge Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service – Prompt Forge",
    description: "Read the Prompt Forge Terms of Service before using the platform.",
    images: ["/twitter-image"],
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
