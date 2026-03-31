import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & FAQ – Prompt Forge",
  description:
    "Get help with Prompt Forge. Browse frequently asked questions, troubleshooting guides, and contact our support team.",
  keywords: [
    "prompt forge support",
    "promptforge help",
    "prompt forge faq",
    "AI SaaS builder support",
  ],
  alternates: { canonical: "https://promptforgeai.dev/support" },
  openGraph: {
    title: "Support & FAQ – Prompt Forge",
    description:
      "Get help with Prompt Forge. Browse FAQs, troubleshooting guides, and contact support.",
    url: "https://promptforgeai.dev/support",
    siteName: "Prompt Forge",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prompt Forge Support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support & FAQ – Prompt Forge",
    description: "Get help with Prompt Forge. FAQs, troubleshooting, and contact support.",
    images: ["/twitter-image"],
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
