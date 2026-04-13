import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts as staticPosts, getPost as getStaticPost } from "../posts";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

interface NormalizedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  readTime: number;
  category: string;
  content: string;
}

async function getApiPost(slug: string): Promise<NormalizedPost | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${base}/api/v1/blog/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const p = await res.json() as { slug: string; title: string; description: string; createdAt: string; updatedAt?: string; readTime: number; category: string; content?: string };
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.createdAt,
      updatedAt: p.updatedAt ?? p.createdAt,
      readTime: p.readTime,
      category: p.category,
      content: p.content ?? "",
    };
  } catch {
    return null;
  }
}

async function getApiPostList(): Promise<NormalizedPost[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${base}/api/v1/blog`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: { slug: string; title: string; description: string; createdAt: string; readTime: number; category: string }) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.createdAt,
      readTime: p.readTime,
      category: p.category,
      content: "",
    }));
  } catch {
    return [];
  }
}

async function resolvePost(slug: string): Promise<NormalizedPost | null> {
  // Try static posts first
  const staticPost = getStaticPost(slug);
  if (staticPost) {
    return {
      slug: staticPost.slug,
      title: staticPost.title,
      description: staticPost.description,
      date: staticPost.date,
      readTime: staticPost.readTime,
      category: staticPost.category,
      content: staticPost.content,
    };
  }
  // Fall back to API
  return getApiPost(slug);
}

interface Props {
  params: { slug: string };
}

// Pre-render static posts at build time; API posts are rendered on demand
export function generateStaticParams() {
  return staticPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await resolvePost(params.slug);
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

export default async function BlogPostPage({ params }: Props) {
  const post = await resolvePost(params.slug);
  if (!post) notFound();

  // Build a merged sorted list for prev/next navigation
  const apiList = await getApiPostList();
  const apiSlugs = new Set(apiList.map((p) => p.slug));
  const mergedStatic: NormalizedPost[] = staticPosts
    .filter((p) => !apiSlugs.has(p.slug))
    .map((p) => ({ ...p }));
  const allSorted = [...apiList, ...mergedStatic].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const idx = allSorted.findIndex((p) => p.slug === post.slug);
  const prev = allSorted[idx + 1];
  const next = allSorted[idx - 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { "@type": "Organization", name: "Prompt Forge", url: "https://promptforgeai.dev" },
    publisher: {
      "@type": "Organization",
      name: "Prompt Forge",
      url: "https://promptforgeai.dev",
      logo: { "@type": "ImageObject", url: "https://promptforgeai.dev/opengraph-image" },
    },
    url: `https://promptforgeai.dev/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://promptforgeai.dev/blog/${post.slug}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://promptforgeai.dev" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://promptforgeai.dev/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://promptforgeai.dev/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <AnnouncementBanner />
      <LandingNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <main className="min-h-screen bg-[#0a0b14] text-white pt-20">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Tüm makaleler
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
                {new Date(post.date).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} dk okuma
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
              AI ile SaaS&apos;ınızı oluşturmaya hazır mısınız?
            </p>
            <p className="text-slate-400 text-sm mb-5">
              Tek bir prompttan eksiksiz bir NestJS + Prisma backend oluşturun — ücretsiz deneyin.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              Ücretsiz başla
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
                  <ArrowLeft className="w-3 h-3" /> Önceki
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
                  Sonraki <ArrowRight className="w-3 h-3" />
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
