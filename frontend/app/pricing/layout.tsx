import type { Metadata } from "next";

const pricingFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Hesap ayarlarınızdan istediğiniz zaman iptal edebilirsiniz. Mevcut ödeme döneminizin sonuna kadar hizmetiniz aktif kalmaya devam eder.",
      },
    },
    {
      "@type": "Question",
      name: "Üretim limitime ulaşırsam ne olur?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bildirim alırsınız ve bir sonraki fatura döneminde kotanız sıfırlanana kadar yeni üretimler duraklatılır. Dilediğiniz zaman daha üst bir plana geçerek devam edebilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "Yıllık ödeme indirimi var mı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Yıllık ödeme seçeneğinde aylık fiyata kıyasla %20 indirim uygulanır. Starter planında aylık ₺950 yerine ₺760/ay, Pro planında ₺3.250 yerine ₺2.600/ay ödersiniz.",
      },
    },
    {
      "@type": "Question",
      name: "İade politikanız nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "İlk ödemenizden itibaren 14 gün içinde memnun kalmazsanız koşulsuz iade yapıyoruz. İade talebinizi hello@promptforgeai.dev adresine iletmeniz yeterlidir.",
      },
    },
    {
      "@type": "Question",
      name: "Plan değiştirebilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. İstediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Yükseltmeler hemen geçerli olur; düşürmeler bir sonraki fatura döneminin başında uygulanır.",
      },
    },
    {
      "@type": "Question",
      name: "Ücretsiz plan neler sunar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ücretsiz planda aylık 3 uygulama üretimi hakkı, temel entity desteği (en fazla 5) ve Prisma şema üretimi bulunmaktadır. Kredi kartı gerekmeden hemen başlayabilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "PromptForge ile hangi teknolojiler üretiliyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PromptForge; NestJS backend, Prisma ORM şeması ve migration'ları, PostgreSQL veritabanı, JWT kimlik doğrulama, Swagger/OpenAPI dokümantasyonu, Docker Compose ve CI/CD yapılandırması üretmektedir.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Fiyatlandırma — PromptForge | Ücretsiz, Starter ₺950 ve Pro ₺3.250",
  description:
    "PromptForge fiyatlandırma planları: Ücretsiz plan ile başlayın, Starter ₺950/ay ile aylık 50 uygulama üretin, Pro ₺3.250/ay ile sınırsız üretim yapın. 14 günlük koşulsuz iade garantisi.",
  keywords: [
    "promptforge fiyat",
    "promptforge plan",
    "AI kod üretici fiyat",
    "SaaS generator fiyatlandırma",
    "NestJS generator fiyat",
    "backend generator plan",
    "yapay zeka kod üretici abonelik",
    "promptforge starter",
    "promptforge pro",
    "ücretsiz SaaS generator",
  ],
  alternates: { canonical: "https://promptforgeai.dev/pricing" },
  openGraph: {
    title: "PromptForge Fiyatlandırma — Ücretsiz, Starter ₺950 ve Pro ₺3.250",
    description:
      "Ücretsiz başlayın. Starter ₺950/ay ile 50 uygulama, Pro ₺3.250/ay ile sınırsız üretim. 14 günlük koşulsuz iade garantisi.",
    url: "https://promptforgeai.dev/pricing",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Fiyatlandırma" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge Fiyatlandırma — Ücretsiz, Starter ₺950 ve Pro ₺3.250",
    description: "Ücretsiz başlayın. Starter ₺950/ay, Pro ₺3.250/ay. 14 günlük iade garantisi.",
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
