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
    "AI",
    "SaaS builder",
    "code generation",
    "natural language",
    "Next.js",
    "backend generator",
  ],
  authors: [{ name: "PromptForge" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
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
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
