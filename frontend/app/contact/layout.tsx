import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – PromptForge",
  description:
    "Get in touch with the PromptForge team. We respond within 24 hours. Questions about billing, technical support, or partnerships.",
  alternates: { canonical: "https://promptforgeai.dev/contact" },
  openGraph: {
    title: "Contact PromptForge",
    description: "Get in touch — we respond within 24 hours.",
    url: "https://promptforgeai.dev/contact",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contact PromptForge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PromptForge",
    description: "Get in touch — we respond within 24 hours.",
    images: ["/twitter-image"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
