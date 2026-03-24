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
    "NestJS generator",
    "Prisma schema generator",
    "backend generator",
    "natural language programming",
    "AI SaaS",
    "code generation",
  ],
  authors: [{ name: "PromptForge" }],
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
      "Transform natural language prompts into fully functional SaaS applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge – Build SaaS Apps with AI",
    description:
      "Transform natural language prompts into fully functional SaaS applications.",
  },
  icons: {
    icon: "/favicon.ico",
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PromptForge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://promptforgeai.dev",
  description:
    "AI-powered platform that generates full-stack SaaS applications from natural language prompts.",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Starter",
      price: "29",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "99",
      priceCurrency: "USD",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
