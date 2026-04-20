import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import PostHogProvider from "@components/providers/PostHogProvider";
import PostHogPageView from "@components/providers/PostHogPageView";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur",
    template: "%s | PromptForge",
  },
  description:
    "PromptForge, SaaS fikrinizi 5 dakika içinde üretime hazır koda dönüştüren yapay zeka destekli bir uygulama oluşturucudur. Tek prompttan eksiksiz NestJS backend, Prisma şeması, REST API ve Docker kurulumu oluşturun. Ücretsiz deneyin.",
  keywords: [
    "promptforge",
    "prompt forge",
    "yapay zeka kod üretici",
    "AI kod üretici",
    "SaaS oluşturucu",
    "NestJS generator",
    "Prisma şema üretici",
    "backend generator",
    "REST API generator",
    "AI uygulama oluşturucu",
    "kod üretici",
    "SaaS geliştirme",
    "yapay zeka ile uygulama geliştir",
    "no-code backend",
    "AI SaaS builder",
    "NestJS boilerplate",
    "full-stack kod üretimi",
    "SaaS MVP generator",
    "Lovable alternatif",
    "Bolt.new alternatif",
    "v0 alternatif",
    "AI developer tool",
    "build SaaS with AI",
    "generate SaaS from prompt",
  ],
  authors: [{ name: "PromptForge", url: "https://promptforgeai.dev" }],
  creator: "Murat Dumlu Bilgi Teknolojileri",
  publisher: "PromptForge",
  metadataBase: new URL("https://promptforgeai.dev"),
  alternates: {
    canonical: "https://promptforgeai.dev",
    languages: { "tr-TR": "https://promptforgeai.dev" },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://promptforgeai.dev",
    siteName: "PromptForge",
    title: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur",
    description:
      "SaaS fikrinizi 5 dakika içinde üretime hazır koda dönüştürün. NestJS backend, Prisma şeması, REST API, Docker — hepsi tek bir prompttan.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur",
    description:
      "SaaS fikrinizi 5 dakika içinde üretime hazır koda dönüştürün. Ücretsiz deneyin.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-icon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PromptForge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://promptforgeai.dev",
  inLanguage: "tr-TR",
  description:
    "Yapay zeka destekli, doğal dilden üretime hazır tam yığın SaaS uygulamaları oluşturan platform.",
  screenshot: "https://promptforgeai.dev/opengraph-image",
  offers: [
    { "@type": "Offer", name: "Ücretsiz", price: "0", priceCurrency: "TRY" },
    { "@type": "Offer", name: "Starter", price: "950", priceCurrency: "TRY" },
    { "@type": "Offer", name: "Pro", price: "3250", priceCurrency: "TRY" },
  ],
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Murat Dumlu Bilgi Teknolojileri",
  alternateName: "PromptForge",
  url: "https://promptforgeai.dev",
  logo: "https://promptforgeai.dev/opengraph-image",
  email: "hello@promptforgeai.dev",
  telephone: "+905426674230",
  address: {
    "@type": "PostalAddress",
    streetAddress: "TepeTepe Prime İş ve Yaşam Merkezi, Mustafa Kemal Mah. Dumlupınar Bulvarı",
    addressLocality: "Çankaya",
    addressRegion: "Ankara",
    addressCountry: "TR",
  },
  sameAs: [
    "https://github.com/MrtDml/promptforge",
    "https://twitter.com/promptforgeai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+905426674230",
    contactType: "customer support",
    availableLanguage: "Turkish",
    url: "https://promptforgeai.dev/contact",
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PromptForge",
  alternateName: "Prompt Forge",
  url: "https://promptforgeai.dev",
  inLanguage: "tr-TR",
  description: "PromptForge, SaaS fikrinizi 5 dakika içinde üretime hazır koda dönüştüren yapay zeka destekli platformdur.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://promptforgeai.dev/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
      </head>
      <body className="bg-[#0a0b14] text-slate-100 antialiased min-h-screen font-sans">
        <PostHogProvider>
          <PostHogPageView />
          {children}
        </PostHogProvider>
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D7IVTJJC77UDQGOIT4M0');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1368590561658379');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1368590561658379&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
