import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – PromptForge",
  description: "PromptForge Terms of Service. Read our terms before using the platform.",
  alternates: { canonical: "https://promptforgeai.dev/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
