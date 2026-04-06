import type { Metadata } from "next";

const pricingFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I cancel my subscription at any time?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You can cancel at any time from your dashboard settings. Your plan remains active until the end of the billing period — no questions asked." },
    },
    {
      "@type": "Question",
      name: "What happens when I reach my generation limit?",
      acceptedAnswer: { "@type": "Answer", text: "You will be notified and your account will pause new generations until the next billing cycle resets your quota, or you upgrade to a higher plan." },
    },
    {
      "@type": "Question",
      name: "Is there an annual discount?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Paying annually saves you 2 months compared to the monthly price — equivalent to a 17% discount on Starter and Pro plans." },
    },
    {
      "@type": "Question",
      name: "Do you offer refunds?",
      acceptedAnswer: { "@type": "Answer", text: "We offer a 14-day money-back guarantee on your first payment if you are not satisfied with the service." },
    },
    {
      "@type": "Question",
      name: "Can I switch plans?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades take effect at the start of the next billing cycle." },
    },
  ],
};

export const metadata: Metadata = {
  title: "Pricing – Prompt Forge",
  description:
    "Start free with 3 AI-generated apps per month. Upgrade to Starter ($29/mo) or Pro ($99/mo) for unlimited generations, GitHub export, public showcase, and AI chat.",
  keywords: [
    "prompt forge pricing",
    "promptforge pricing",
    "AI SaaS builder pricing",
    "AI code generator plans",
    "SaaS app generator free",
  ],
  alternates: { canonical: "https://promptforgeai.dev/pricing" },
  openGraph: {
    title: "Pricing – Prompt Forge",
    description:
      "Start free. Upgrade for unlimited AI-generated SaaS apps, GitHub export, and more.",
    url: "https://promptforgeai.dev/pricing",
    siteName: "Prompt Forge",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prompt Forge Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing – Prompt Forge",
    description: "Start free. Upgrade for unlimited Prompt Forge AI-generated SaaS apps.",
    images: ["/twitter-image"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqJsonLd) }}
      />
      {children}
    </>
  );
}
