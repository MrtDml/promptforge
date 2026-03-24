import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – PromptForge",
  description:
    "Simple, transparent pricing. Start free with 3 app generations per month. Upgrade to Starter ($29/mo) or Pro ($99/mo) for more power.",
  alternates: { canonical: "https://promptforgeai.dev/pricing" },
  openGraph: {
    title: "Pricing – PromptForge",
    description: "Free, Starter ($29/mo), and Pro ($99/mo) plans. Start building today.",
    url: "https://promptforgeai.dev/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
