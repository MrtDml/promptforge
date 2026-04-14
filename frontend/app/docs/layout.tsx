import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokümantasyon — PromptForge",
  description:
    "PromptForge'u kullanarak doğal dil promptlarından full-stack SaaS uygulamaları üretmeyi öğrenin. Hızlı başlangıç kılavuzları, prompt örnekleri ve API referansı.",
  keywords: [
    "promptforge dokümantasyon",
    "promptforge rehber",
    "promptforge nasıl kullanılır",
    "AI kod üretici kılavuzu",
    "SaaS üretici eğitimi",
    "NestJS generator kullanımı",
    "prompt ile backend üretme",
  ],
  alternates: { canonical: "https://promptforgeai.dev/docs" },
  openGraph: {
    title: "Dokümantasyon — PromptForge",
    description:
      "PromptForge ile Türkçe açıklamalardan full-stack SaaS uygulamaları üretin. Kılavuzlar, örnekler ve API referansı.",
    url: "https://promptforgeai.dev/docs",
    siteName: "PromptForge",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Dokümantasyon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dokümantasyon — PromptForge",
    description: "PromptForge ile Türkçe açıklamalardan full-stack SaaS uygulamaları üretin.",
    images: ["/twitter-image"],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
