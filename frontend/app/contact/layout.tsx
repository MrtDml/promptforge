import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – Prompt Forge",
  description:
    "Get in touch with the Prompt Forge team. We respond within 24 hours. Questions about billing, technical support, or partnerships.",
  keywords: ["contact prompt forge", "promptforge support", "AI SaaS builder contact"],
  alternates: { canonical: "https://promptforgeai.dev/contact" },
  openGraph: {
    title: "Contact Prompt Forge",
    description: "Get in touch with Prompt Forge — we respond within 24 hours.",
    url: "https://promptforgeai.dev/contact",
    siteName: "Prompt Forge",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contact Prompt Forge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Prompt Forge",
    description: "Get in touch with Prompt Forge — we respond within 24 hours.",
    images: ["/twitter-image"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
