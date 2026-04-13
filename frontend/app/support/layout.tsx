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

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
