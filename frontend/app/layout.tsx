import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
    default: "Prompt Forge – AI SaaS Code Generator | PromptForge",
    template: "%s | Prompt Forge",
  },
  description:
    "Prompt Forge is an AI-powered SaaS builder that transforms natural language prompts into production-ready full-stack applications. Generate NestJS backends, Prisma schemas, REST APIs, and Docker configs instantly.",
  keywords: [
    "prompt forge",
    "promptforge",
    "prompt forge ai",
    "prompt forge tool",
    "prompt forge saas",
    "AI code generator",
    "SaaS builder",
    "SaaS app generator",
    "NestJS generator",
    "Prisma schema generator",
    "backend generator",
    "AI SaaS builder",
    "generate SaaS from prompt",
    "no-code backend builder",
    "AI software generator",
    "build SaaS with AI",
    "automatic code generation",
    "REST API generator",
    "full-stack code generator",
    "AI developer tool",
    "Lovable alternative",
    "Bolt.new alternative",
    "v0 alternative",
  ],
  authors: [{ name: "PromptForge" }],
  creator: "PromptForge",
  publisher: "PromptForge",
  metadataBase: new URL("https://promptforgeai.dev"),
  alternates: {
    canonical: "https://promptforgeai.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://promptforgeai.dev",
    siteName: "Prompt Forge",
    title: "Prompt Forge – AI SaaS Code Generator | PromptForge",
    description:
      "Prompt Forge transforms natural language prompts into production-ready SaaS applications. Generate NestJS backends, Prisma schemas, REST APIs, and Docker configs instantly.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PromptForge – Build SaaS Apps with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Forge – AI SaaS Code Generator",
    description:
      "Prompt Forge transforms natural language prompts into production-ready SaaS applications.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
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
  description:
    "AI-powered platform that generates full-stack SaaS applications from natural language prompts.",
  screenshot: "https://promptforgeai.dev/opengraph-image",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
    { "@type": "Offer", name: "Starter", price: "29", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro", price: "99", priceCurrency: "USD" },
  ],
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Prompt Forge",
  alternateName: "PromptForge",
  url: "https://promptforgeai.dev",
  logo: "https://promptforgeai.dev/opengraph-image",
  sameAs: [
    "https://github.com/MrtDml/promptforge",
    "https://twitter.com/promptforgeai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://promptforgeai.dev/contact",
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Prompt Forge",
  alternateName: "PromptForge",
  url: "https://promptforgeai.dev",
  description: "Prompt Forge is an AI-powered platform that generates production-ready SaaS applications from natural language prompts.",
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
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen font-sans">
        <PostHogProvider>
          <PostHogPageView />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
