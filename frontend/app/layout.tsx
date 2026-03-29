import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PromptForge – Build SaaS Apps with AI",
    template: "%s | PromptForge",
  },
  description:
    "Transform natural language prompts into fully functional SaaS applications. Generate backend APIs, database schemas, and frontend code instantly.",
  keywords: [
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
    siteName: "PromptForge",
    title: "PromptForge – Build SaaS Apps with AI",
    description:
      "Transform natural language prompts into fully functional SaaS applications. Generate backend APIs, database schemas, and frontend code instantly.",
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
    title: "PromptForge – Build SaaS Apps with AI",
    description:
      "Transform natural language prompts into fully functional SaaS applications.",
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
  name: "PromptForge",
  url: "https://promptforgeai.dev",
  logo: "https://promptforgeai.dev/opengraph-image",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://promptforgeai.dev/contact",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is PromptForge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PromptForge is an AI-powered platform that generates production-ready full-stack SaaS applications from plain English descriptions. It creates a NestJS backend, Prisma schema, REST API, Docker setup, and more in minutes.",
      },
    },
    {
      "@type": "Question",
      name: "How does PromptForge work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply describe your SaaS idea in plain English. PromptForge parses your description, generates a database schema, and creates complete production-ready code including backend API, database migrations, authentication, and Docker configuration.",
      },
    },
    {
      "@type": "Question",
      name: "Is PromptForge free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PromptForge offers a free plan with 3 app generations per month. Paid plans start at $29/month for more generations and advanced features.",
      },
    },
    {
      "@type": "Question",
      name: "What tech stack does PromptForge generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PromptForge generates NestJS (Node.js) backends with Prisma ORM, PostgreSQL database, JWT authentication, REST API with Swagger documentation, and Docker configuration. It also supports Express.js as an alternative framework.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export my code to GitHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PromptForge allows you to push your generated code directly to a new GitHub repository with one click using your personal access token.",
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
