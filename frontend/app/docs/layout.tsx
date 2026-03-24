import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation – PromptForge",
  description: "Learn how to use PromptForge to generate full-stack SaaS applications from natural language prompts.",
  alternates: { canonical: "https://promptforgeai.dev/docs" },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
