import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — PromptForge",
  description:
    "PromptForge Kullanım Koşulları. Platformu kullanmadan önce kullanım şartlarını ve koşullarını okuyun.",
  keywords: [
    "promptforge kullanım koşulları",
    "promptforge şartlar",
    "AI SaaS builder kullanım koşulları",
    "promptforge hizmet sözleşmesi",
  ],
  alternates: { canonical: "https://promptforgeai.dev/terms" },
  openGraph: {
    title: "Kullanım Koşulları — PromptForge",
    description: "PromptForge Kullanım Koşulları. Platformu kullanmadan önce şartlarımızı okuyun.",
    url: "https://promptforgeai.dev/terms",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Kullanım Koşulları" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kullanım Koşulları — PromptForge",
    description: "PromptForge Kullanım Koşulları. Platformu kullanmadan önce şartlarımızı okuyun.",
    images: ["/twitter-image"],
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
