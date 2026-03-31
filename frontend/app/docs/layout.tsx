import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation – Prompt Forge",
  description:
    "Learn how to use Prompt Forge to generate full-stack SaaS applications from natural language prompts. Quick start guides, prompt examples, and API reference.",
  keywords: [
    "prompt forge documentation",
    "prompt forge guide",
    "promptforge docs",
    "how to use prompt forge",
    "AI code generator guide",
    "SaaS generator tutorial",
  ],
  alternates: { canonical: "https://promptforgeai.dev/docs" },
  openGraph: {
    title: "Documentation – Prompt Forge",
    description:
      "Learn how to use Prompt Forge to generate full-stack SaaS apps from plain English. Guides, examples, and API reference.",
    url: "https://promptforgeai.dev/docs",
    siteName: "Prompt Forge",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prompt Forge Documentation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation – Prompt Forge",
    description: "Learn how to use Prompt Forge to generate full-stack SaaS apps from plain English.",
    images: ["/twitter-image"],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
