import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Prompt Forge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prompt Forge (also written as PromptForge) is an AI-powered platform that generates production-ready full-stack SaaS applications from plain English descriptions. It creates a NestJS backend, Prisma schema, REST API, Docker setup, and more in minutes.",
      },
    },
    {
      "@type": "Question",
      name: "How does Prompt Forge work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply describe your SaaS idea in plain English. Prompt Forge parses your description, generates a database schema, and creates complete production-ready code including backend API, database migrations, authentication, and Docker configuration.",
      },
    },
    {
      "@type": "Question",
      name: "Is Prompt Forge free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Prompt Forge offers a free plan with 3 app generations per month. Paid plans start at $29/month for more generations and advanced features.",
      },
    },
    {
      "@type": "Question",
      name: "What tech stack does Prompt Forge generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prompt Forge generates NestJS (Node.js) backends with Prisma ORM, PostgreSQL database, JWT authentication, REST API with Swagger documentation, and Docker configuration. It also supports Express.js as an alternative framework.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export my code to GitHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Prompt Forge allows you to push your generated code directly to a new GitHub repository with one click using your personal access token.",
      },
    },
    {
      "@type": "Question",
      name: "Is Prompt Forge a Lovable or Bolt alternative?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prompt Forge is a backend-first alternative to Lovable, Bolt.new, and v0. While those tools focus on UI generation, Prompt Forge specializes in generating production-grade NestJS backends, APIs, and database schemas that engineering teams can actually deploy.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Prompt Forge for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prompt Forge is built for developers, startup founders, and engineering teams who want to rapidly prototype and ship SaaS backends. It is ideal for anyone who wants production-ready Node.js code without spending days on boilerplate.",
      },
    },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
