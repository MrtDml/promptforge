import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – PromptForge",
  description: "PromptForge Privacy Policy. Learn how we collect, use, and protect your personal data.",
  alternates: { canonical: "https://promptforgeai.dev/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
