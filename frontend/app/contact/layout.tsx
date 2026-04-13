import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim — PromptForge | Destek ve Sorularınız",
  description:
    "PromptForge ekibiyle iletişime geçin. Faturalama, teknik destek veya iş ortaklığı sorularınız için en geç 2 iş günü içinde yanıt veriyoruz.",
  keywords: [
    "promptforge iletişim",
    "promptforge destek",
    "AI SaaS builder iletişim",
    "promptforge müşteri hizmetleri",
    "promptforge e-posta",
  ],
  alternates: { canonical: "https://promptforgeai.dev/contact" },
  openGraph: {
    title: "PromptForge ile İletişime Geçin",
    description: "Faturalama, teknik destek veya iş ortaklığı için bize ulaşın — en geç 2 iş günü içinde yanıt veriyoruz.",
    url: "https://promptforgeai.dev/contact",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge İletişim" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge ile İletişime Geçin",
    description: "Sorularınız için bize ulaşın — en geç 2 iş günü içinde yanıt veriyoruz.",
    images: ["/twitter-image"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
