import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destek ve SSS — PromptForge | Sık Sorulan Sorular",
  description:
    "PromptForge hakkında yardım alın. Sık sorulan sorular, sorun giderme rehberleri ve destek ekibimizle iletişim.",
  keywords: [
    "promptforge destek",
    "promptforge yardım",
    "promptforge sık sorulan sorular",
    "AI SaaS builder destek",
    "promptforge SSS",
    "promptforge nasıl kullanılır",
  ],
  alternates: { canonical: "https://promptforgeai.dev/support" },
  openGraph: {
    title: "Destek ve SSS — PromptForge",
    description:
      "PromptForge hakkında yardım alın. Sık sorulan sorular, sorun giderme rehberleri ve destek ekibimizle iletişim.",
    url: "https://promptforgeai.dev/support",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Destek" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Destek ve SSS — PromptForge",
    description: "PromptForge hakkında yardım alın. SSS, sorun giderme ve destek iletişimi.",
    images: ["/twitter-image"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Üretilen kod gerçekten çalışıyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. PromptForge; Prisma şeması, CRUD API'leri, auth modülü, Dockerfile ve README dahil olmak üzere eksiksiz, çalıştırılabilir bir NestJS projesi üretir. İndirin, npm install çalıştırın, hazır.",
      },
    },
    {
      "@type": "Question",
      name: "Kaç entity destekleniyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ücretsiz plan, uygulama başına en fazla 5 entity'yi destekler. Starter sınırsız entity sunar.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi veritabanı kullanılıyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tüm planlar Prisma ORM ile PostgreSQL kullanır. Üretilen docker-compose.yml, geliştirme için yerel bir PostgreSQL container'ını otomatik olarak ayarlar.",
      },
    },
    {
      "@type": "Question",
      name: "Aboneliğimi nasıl iptal ederim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dashboard → Ayarlar → Abonelik bölümüne gidin ve 'Aboneliği İptal Et' düğmesine tıklayın. İptal, mevcut fatura döneminin sonunda geçerli olur.",
      },
    },
    {
      "@type": "Question",
      name: "Üretilen kodu ticari bir projede kullanabilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kesinlikle. Üretilen kodun %100'ü size aittir. Herhangi bir lisans kısıtlaması veya telif hakkı yoktur.",
      },
    },
    {
      "@type": "Question",
      name: "Türkçe prompt yazabilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet — PromptForge, Türkçe dahil çoğu büyük dilde yazılan promptları anlayabilir. Üretilen kod, yorumlar ve değişken adları her zaman İngilizce olacaktır.",
      },
    },
  ],
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
