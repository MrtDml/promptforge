import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Fiyatlandırma – Her Geliştirici İçin Plan",
  description:
    "PromptForge fiyatlandırma planları: Ücretsiz (ayda 3 üretim), Starter ₺950/ay (50 üretim, sınırsız entity), Pro ₺3.250/ay (sınırsız). Kredi kartı gerekmez.",
  keywords: [
    "promptforge fiyatlandırma",
    "AI SaaS builder fiyat",
    "NestJS generator plan",
    "ücretsiz SaaS oluşturucu",
    "backend generator fiyat",
    "starter plan",
    "pro plan",
  ],
  alternates: { canonical: "https://promptforgeai.dev/pricing" },
  openGraph: {
    title: "Fiyatlandırma – PromptForge",
    description:
      "Ücretsiz başla, büyüdükçe ölçeklen. Gizli ücret yok, başlamak için kredi kartı gerekmez.",
    url: "https://promptforgeai.dev/pricing",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "PromptForge Fiyatlandırma",
  url: "https://promptforgeai.dev/pricing",
  description: "PromptForge AI SaaS builder için fiyatlandırma planları.",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "PromptForge",
    url: "https://promptforgeai.dev",
    offers: [
      {
        "@type": "Offer",
        name: "Ücretsiz Plan",
        price: "0",
        priceCurrency: "TRY",
        description: "Ayda 3 uygulama üretimi, en fazla 5 entity. Kredi kartı gerekmez.",
        eligibleDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      {
        "@type": "Offer",
        name: "Starter Plan",
        price: "950",
        priceCurrency: "TRY",
        description: "Ayda 50 üretim, sınırsız entity, ilişki desteği, Docker ve CI/CD.",
        eligibleDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "3250",
        priceCurrency: "TRY",
        description: "Sınırsız üretim, takım workspace, öncelikli kuyruk, SLA garantisi.",
        eligibleDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PricingClient />
    </>
  );
}
