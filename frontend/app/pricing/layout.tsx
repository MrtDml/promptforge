import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – PromptForge",
  description:
    "Start free with 3 AI-generated apps per month. Upgrade to Starter ($29/mo) or Pro ($99/mo) for unlimited generations, GitHub export, public showcase, and AI chat.",
  keywords: [
    "PromptForge pricing",
    "AI SaaS builder pricing",
    "AI code generator plans",
    "SaaS app generator free",
  ],
  alternates: { canonical: "https://promptforgeai.dev/pricing" },
  openGraph: {
    title: "Pricing – PromptForge",
    description:
      "Start free. Upgrade for unlimited AI-generated SaaS apps, GitHub export, and more.",
    url: "https://promptforgeai.dev/pricing",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing – PromptForge",
    description: "Start free. Upgrade for unlimited AI-generated SaaS apps.",
    images: ["/twitter-image"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
