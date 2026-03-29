import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation – PromptForge",
  description:
    "Learn how to use PromptForge to generate full-stack SaaS applications from natural language prompts. Guides, API reference, and examples.",
  keywords: [
    "PromptForge documentation",
    "AI code generator guide",
    "how to use PromptForge",
    "SaaS generator tutorial",
  ],
  alternates: { canonical: "https://promptforgeai.dev/docs" },
  openGraph: {
    title: "Documentation – PromptForge",
    description:
      "Learn how to generate full-stack SaaS apps from plain English. Guides, examples, and API reference.",
    url: "https://promptforgeai.dev/docs",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation – PromptForge",
    description: "Learn how to generate full-stack SaaS apps from plain English.",
    images: ["/twitter-image"],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
