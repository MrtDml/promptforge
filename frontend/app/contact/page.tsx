import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "İletişim – Bize Ulaşın",
  description:
    "PromptForge ekibiyle iletişime geçin. Sorularınız, geri bildirimleriniz veya ortaklık teklifleriniz için hello@promptforgeai.dev adresine yazın ya da formu doldurun.",
  alternates: { canonical: "https://promptforgeai.dev/contact" },
  openGraph: {
    title: "İletişim – PromptForge",
    description: "PromptForge ekibiyle iletişime geçin. Genellikle 24 saat içinde yanıt veriyoruz.",
    url: "https://promptforgeai.dev/contact",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "PromptForge İletişim",
  url: "https://promptforgeai.dev/contact",
  description: "PromptForge destek ve iletişim sayfası",
  mainEntity: {
    "@type": "Organization",
    name: "Murat Dumlu Bilgi Teknolojileri",
    email: "hello@promptforgeai.dev",
    telephone: "+905426674230",
    url: "https://promptforgeai.dev",
    address: {
      "@type": "PostalAddress",
      streetAddress: "TepeTepe Prime İş ve Yaşam Merkezi, Mustafa Kemal Mah. Dumlupınar Bulvarı",
      addressLocality: "Çankaya",
      addressRegion: "Ankara",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+905426674230",
      contactType: "customer support",
      email: "hello@promptforgeai.dev",
      availableLanguage: "Turkish",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactClient />
    </>
  );
}
