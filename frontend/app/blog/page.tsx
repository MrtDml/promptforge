import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./posts";
import LandingNav from "@components/layout/LandingNav";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – PromptForge",
  description:
    "Guides, tutorials, and insights on AI code generation, NestJS, SaaS architecture, and building production-ready applications faster.",
  keywords: [
    "AI code generation blog",
    "NestJS tutorials",
    "SaaS development guide",
    "build SaaS with AI",
    "Prisma schema guide",
  ],
  alternates: { canonical: "https://promptforgeai.dev/blog" },
  openGraph: {
    title: "Blog – PromptForge",
    description:
      "Guides, tutorials, and insights on AI code generation, NestJS, and SaaS architecture.",
    url: "https://promptforgeai.dev/blog",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog – PromptForge",
    description: "Guides, tutorials, and insights on AI code generation and SaaS development.",
    images: ["/twitter-image"],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Tutorial: "bg-indigo-950/60 border-indigo-800/50 text-indigo-300",
  Engineering: "bg-blue-950/60 border-blue-800/50 text-blue-300",
  Comparison: "bg-purple-950/60 border-purple-800/50 text-purple-300",
};

export default function BlogPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const [featured, ...rest] = sorted;

  return (
    <>
      <LandingNav />
      <main className="min-h-screen bg-[#0a0b14] text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Blog</h1>
            <p className="text-slate-400 text-lg">
              Guides, tutorials, and engineering insights on AI-powered SaaS development.
            </p>
          </div>

          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="block glass-card p-7 mb-8 hover:border-slate-600/80 transition-all group"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  CATEGORY_COLORS[featured.category] ?? "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {featured.category}
              </span>
              <span className="text-xs text-slate-500">Featured</span>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-3 leading-snug">
              {featured.title}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-5">{featured.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featured.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime} min read
                </span>
              </div>
              <span className="text-indigo-400 group-hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors">
                Read article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Post grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass-card p-5 hover:border-slate-600/80 transition-all group flex flex-col"
              >
                <div className="mb-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                      CATEGORY_COLORS[post.category] ?? "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2 leading-snug flex-1">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
