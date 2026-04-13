import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — PromptForge",
  description:
    "PromptForge Gizlilik Politikası. Kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve KVKK ile ilgili mevzuat kapsamında nasıl koruduğumuzu öğrenin.",
  keywords: [
    "promptforge gizlilik politikası",
    "promptforge kişisel veri",
    "promptforge KVKK",
    "AI SaaS gizlilik",
  ],
  alternates: { canonical: "https://promptforgeai.dev/privacy" },
  openGraph: {
    title: "Gizlilik Politikası — PromptForge",
    description: "PromptForge'un kişisel verilerinizi nasıl topladığını ve koruduğunu öğrenin.",
    url: "https://promptforgeai.dev/privacy",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Gizlilik Politikası" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gizlilik Politikası — PromptForge",
    description: "PromptForge'un kişisel verilerinizi nasıl topladığını ve koruduğunu öğrenin.",
    images: ["/twitter-image"],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
