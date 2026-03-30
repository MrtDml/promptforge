import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts, getPost } from "../posts";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return { title: "Post Not Found – PromptForge" };
  return {
    title: `${post.title} – PromptForge Blog`,
    description: post.description,
    alternates: { canonical: `https://promptforgeai.dev/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://promptforgeai.dev/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["PromptForge"],
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/twitter-image"],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const idx = sorted.findIndex((p) => p.slug === post.slug);
  const prev = sorted[idx + 1];
  const next = sorted[idx - 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "PromptForge" },
    publisher: { "@type": "Organization", name: "PromptForge", url: "https://promptforgeai.dev" },
    url: `https://promptforgeai.dev/blog/${post.slug}`,
  };

  return (
    <>
      <AnnouncementBanner />
      <LandingNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#0a0b14] text-white pt-20">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All articles
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight mb-4 tracking-tight">
              {post.title}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-5">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500 border-t border-slate-800 pt-5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </div>
          </header>

          {/* Content */}
          <article
            className="prose prose-invert prose-slate max-w-none
              prose-h2:text-xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-4
              prose-ul:text-slate-300 prose-ul:my-4 prose-ul:pl-5
              prose-li:my-1.5 prose-li:leading-relaxed
              prose-strong:text-white
              prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
              prose-blockquote:border-l-indigo-500 prose-blockquote:text-slate-400 prose-blockquote:italic
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-xl
              prose-code:text-indigo-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-table:text-sm prose-th:text-slate-300 prose-td:text-slate-400 prose-th:py-2 prose-td:py-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-14 rounded-xl bg-indigo-950/40 border border-indigo-800/30 p-7 text-center">
            <p className="text-white font-semibold text-lg mb-2">
              Ready to build your SaaS with AI?
            </p>
            <p className="text-slate-400 text-sm mb-5">
              Generate a complete NestJS + Prisma backend from a single prompt — free to try.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              Start for free
            </Link>
          </div>

          {/* Prev / Next */}
          <nav className="mt-10 flex gap-4">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="flex-1 glass-card p-4 hover:border-slate-600/80 transition-all group"
              >
                <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Previous
                </p>
                <p className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors font-medium line-clamp-2">
                  {prev.title}
                </p>
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="flex-1 glass-card p-4 hover:border-slate-600/80 transition-all group text-right"
              >
                <p className="text-xs text-slate-600 mb-1 flex items-center gap-1 justify-end">
                  Next <ArrowRight className="w-3 h-3" />
                </p>
                <p className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors font-medium line-clamp-2">
                  {next.title}
                </p>
              </Link>
            )}
          </nav>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
