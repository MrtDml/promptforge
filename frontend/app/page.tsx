import type { Metadata } from "next";
import Link from "next/link";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "Prompt Forge – Build SaaS Apps from a Single Prompt | PromptForge",
  description:
    "Prompt Forge is an AI SaaS builder that turns your idea into production-ready code in under 5 minutes. Generate a complete NestJS backend, Prisma schema, REST API, and Docker setup from plain English. Free to try.",
  keywords: [
    "prompt forge",
    "promptforge",
    "prompt forge ai",
    "AI SaaS builder",
    "build SaaS with AI",
    "generate SaaS from prompt",
    "AI code generator",
    "NestJS generator",
    "Prisma schema generator",
    "REST API generator",
    "no-code backend",
    "AI app builder",
    "SaaS boilerplate generator",
    "Lovable alternative",
    "Bolt.new alternative",
  ],
  alternates: { canonical: "https://promptforgeai.dev" },
  openGraph: {
    title: "Prompt Forge – Build SaaS Apps from a Single Prompt",
    description:
      "Prompt Forge turns your SaaS idea into production-ready code in under 5 minutes. NestJS backend, Prisma schema, REST API, Docker — all from plain English.",
    url: "https://promptforgeai.dev",
    siteName: "Prompt Forge",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Prompt Forge – Build SaaS Apps with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Forge – Build SaaS Apps from a Single Prompt",
    description:
      "Prompt Forge turns your SaaS idea into production-ready code in under 5 minutes.",
    images: ["/twitter-image"],
  },
};
import AnnouncementBanner from "@components/layout/AnnouncementBanner";
import {
  ArrowRight,
  Zap,
  Code2,
  Database,
  Shield,
  Layers,
  Terminal,
  ChevronRight,
  Star,
  CheckCircle2,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Describe your SaaS idea in plain English and get a complete, working application in seconds.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Database,
    title: "Smart Schema Design",
    description:
      "Automatically designs your database schema with proper relationships, indexes, and constraints.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Code2,
    title: "Full-Stack Code",
    description:
      "Generates REST APIs, database migrations, and frontend components all from one prompt.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Shield,
    title: "Auth Built-In",
    description:
      "Every generated app comes with JWT authentication, role-based access control, and security best practices.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Layers,
    title: "Production Ready",
    description:
      "Generated code follows industry best practices with Docker, CI/CD configs, and environment management.",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    icon: Terminal,
    title: "Developer Friendly",
    description:
      "Clean, readable code with comprehensive README, API documentation, and setup instructions.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe Your App",
    description:
      "Type a natural language description of the SaaS product you want to build.",
  },
  {
    number: "02",
    title: "AI Parses Your Intent",
    description:
      "Our AI extracts entities, relationships, endpoints, and features from your description.",
  },
  {
    number: "03",
    title: "Review the Schema",
    description:
      "Preview the generated data model, API design, and application architecture before generating.",
  },
  {
    number: "04",
    title: "Generate & Download",
    description:
      "Get production-ready code for your entire stack, ready to run locally or deploy to the cloud.",
  },
];

const testimonials = [
  {
    quote: "I described a multi-tenant invoicing app and got a fully working NestJS backend with Prisma in under 4 minutes. Would have taken me 2 days manually.",
    author: "James L.",
    role: "Freelance Full-Stack Developer",
    stars: 5,
  },
  {
    quote: "The relation detection blew my mind. I typed 'users have many projects, projects have many tasks' and it generated the exact schema I had in my head.",
    author: "Priya M.",
    role: "CTO, Fintech Startup",
    stars: 5,
  },
  {
    quote: "We use PromptForge to prototype new features before committing to a full build. Our sprint velocity has improved noticeably since we started.",
    author: "Thomas B.",
    role: "Lead Backend Engineer",
    stars: 5,
  },
  {
    quote: "As a solo founder I can't afford to spend 3 days on boilerplate. PromptForge gets me to a working API in minutes. It's become part of my standard workflow.",
    author: "Elif S.",
    role: "Indie Hacker",
    stars: 5,
  },
  {
    quote: "Skeptical at first, but the generated code is actually clean. Proper DTOs, validation, auth guards — not just a toy scaffold.",
    author: "David O.",
    role: "Senior Software Engineer",
    stars: 4,
  },
  {
    quote: "We evaluated 3 different tools for our agency. PromptForge was the only one that actually understood our prompts and produced production-ready structure.",
    author: "Mia C.",
    role: "Tech Lead, Digital Agency",
    stars: 5,
  },
];

async function fetchApiTestimonials(): Promise<typeof testimonials | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${base}/api/v1/settings/public`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.testimonials_json) {
      const parsed = JSON.parse(data.testimonials_json);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PromptForge",
  url: "https://promptforgeai.dev",
  logo: "https://promptforgeai.dev/logo.png",
  description: "AI-powered SaaS builder — generate production-ready NestJS backends from plain English.",
  sameAs: [],
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PromptForge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://promptforgeai.dev",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free plan available — no credit card required",
  },
  description: "Turn your SaaS idea into production-ready NestJS + Prisma + Docker code in under 5 minutes.",
  featureList: [
    "AI-powered schema generation",
    "NestJS & Express.js code generation",
    "Prisma ORM with migrations",
    "JWT authentication",
    "Docker & CI/CD configs",
    "One-click Railway deployment",
    "AI code assistant chat",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is PromptForge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PromptForge is an AI-powered code generator that turns your plain English description into a complete, production-ready NestJS or Express.js SaaS backend — with Prisma schema, REST APIs, JWT auth, Docker config, and more.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to generate an app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most applications are generated in under 5 minutes. The AI parses your prompt, designs the data model, and writes all the code instantly.",
      },
    },
    {
      "@type": "Question",
      name: "Do I own the generated code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All generated code is 100% yours. There is no vendor lock-in, no proprietary runtime, and no ongoing fee to keep your app running. Download and deploy anywhere.",
      },
    },
    {
      "@type": "Question",
      name: "What frameworks are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PromptForge supports NestJS (recommended — with decorators, dependency injection, and modules) and Express.js (lightweight with Zod validation and Helmet security). Both include Prisma ORM and PostgreSQL.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The free plan includes 3 app generations per month with up to 5 entities. No credit card required. Paid plans start at $29/month for unlimited entities and 50 generations.",
      },
    },
  ],
};

export default async function LandingPage() {
  const apiTestimonials = await fetchApiTestimonials();
  const displayTestimonials = apiTestimonials ?? testimonials;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── JSON-LD Structured Data ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {/* ── Announcement Banner ── */}
      <AnnouncementBanner />
      {/* ── Navbar ── */}
      <LandingNav />

      {/* ── Hero ── */}
      <section className="hero-bg pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300 text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Prompt Forge — AI SaaS Code Generator
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Build your SaaS app{" "}
            <span className="gradient-text">from one sentence</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            <strong className="text-slate-300">Prompt Forge</strong> transforms your natural language description into a
            complete, production-ready SaaS application — backend, database
            schema, APIs, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="btn-primary text-base px-8 py-3.5 glow-indigo"
            >
              Start building for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-base px-8 py-3.5"
            >
              Sign in to dashboard
            </Link>
          </div>

          {/* Demo prompt preview */}
          <div className="glass-card max-w-3xl mx-auto p-6 text-left glow-indigo-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-slate-500 text-xs font-mono">promptforge.dev</span>
            </div>
            <p className="text-slate-300 text-sm font-mono mb-4 leading-relaxed">
              <span className="text-indigo-400">$</span>{" "}
              <span className="text-slate-200">
                &quot;Build a multi-tenant project management SaaS with teams, tasks,
                comments, file attachments, and role-based access. Include
                Stripe billing with free and pro tiers.&quot;
              </span>
            </p>
            <div className="border-t border-slate-700/60 pt-4">
              <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Generated 14 entities · 42 API endpoints · 18 files · Docker ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              PromptForge handles the entire scaffolding process so you can
              focus on what makes your product unique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:border-slate-600/80 transition-all duration-300 group"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-slate-400 text-lg">
              From idea to code in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-5">
                <div className="flex-shrink-0">
                  <span className="text-4xl font-black text-indigo-600/40 font-mono">
                    {step.number}
                  </span>
                </div>
                <div className={`pt-1 ${i < steps.length - 1 ? "border-b border-slate-800 pb-8 md:border-0 md:pb-0" : ""}`}>
                  <h3 className="font-semibold text-xl text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why PromptForge ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              Why teams choose{" "}
              <span className="gradient-text">PromptForge</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Other AI builders generate toy code. PromptForge generates production-grade
              architecture that your engineers can actually ship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Zap,
                title: "10x faster than manual",
                description:
                  "What takes a senior engineer 2 days to scaffold — entities, relations, endpoints, auth, Docker — PromptForge delivers in under 5 minutes.",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
                badge: "Speed",
              },
              {
                icon: Code2,
                title: "Real, clean code",
                description:
                  "Proper NestJS modules, DTOs, Zod validation, auth guards, Prisma migrations — not a toy scaffold. Engineers review and ship, not rewrite.",
                color: "text-green-400",
                bg: "bg-green-400/10",
                badge: "Quality",
              },
              {
                icon: FileText,
                title: "You own the code",
                description:
                  "Every generated file is yours. No vendor lock-in, no proprietary runtime, no monthly fee to keep your app running. Download and deploy anywhere.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                badge: "Ownership",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card p-6 hover:border-slate-600/80 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Comparison callout */}
          <div className="glass-card p-6 md:p-8 border-indigo-600/30 bg-indigo-950/20">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  PromptForge vs. the alternatives
                </h3>
                <p className="text-slate-400 text-sm">
                  Lovable, Bolt, and v0 are great for UI prototyping. PromptForge is built
                  for backend-first teams who need production-ready APIs, not mockups.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:w-80">
                {[
                  { label: "Full backend output", pf: true, others: false },
                  { label: "Prisma + migrations", pf: true, others: false },
                  { label: "You own the code", pf: true, others: "partial" },
                  { label: "No vendor lock-in", pf: true, others: false },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="bg-slate-800/60 rounded-lg px-3 py-2 flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-300 text-xs">{row.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-green-400 text-xs font-bold">✓</span>
                      <span className="text-red-400 text-xs">
                        {row.others === false ? "✗" : "~"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800/60 bg-slate-900/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "12,400+", label: "Apps generated" },
            { value: "3,200+", label: "Developers" },
            { value: "< 5 min", label: "From idea to code" },
            { value: "98%", label: "Satisfaction rate" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What is Prompt Forge ── (SEO anchor section) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            What is <span className="gradient-text">Prompt Forge</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-400 text-base leading-relaxed">
            <div>
              <p className="mb-4">
                <strong className="text-slate-200">Prompt Forge</strong> is an AI-powered code generation platform designed for developers and startup founders who want to ship SaaS products faster. Instead of spending days writing boilerplate, you describe your application in plain English and Prompt Forge generates the entire backend stack for you.
              </p>
              <p>
                The Prompt Forge engine parses your natural language description, identifies entities, relationships, and features, then produces a complete project including NestJS modules, Prisma database schema, REST endpoints, JWT authentication, Docker configuration, and more.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Unlike general-purpose AI tools, <strong className="text-slate-200">Prompt Forge</strong> is purpose-built for backend development. Every file it generates follows production best practices — proper error handling, input validation, role-based access control, and scalable architecture patterns.
              </p>
              <p>
                Prompt Forge is the fastest way to go from a SaaS idea to working code. Teams use it to prototype in hours, accelerate development cycles, and avoid the repetitive work of setting up the same infrastructure patterns project after project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by developers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTestimonials.map((t) => (
              <div key={t.author} className="glass-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.stars ? "fill-yellow-400 text-yellow-400" : "text-slate-700"}`} />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.author}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Free */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-slate-400 text-sm mb-6">Try it out, no credit card needed.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-slate-400 text-sm ml-2">/ month</span>
              </div>
              <Link href="/register" className="btn-ghost w-full flex items-center justify-center gap-2 mb-8">
                Get started free
              </Link>
              <ul className="space-y-3">
                {["3 app generations / month", "Up to 5 entities per app", "Prisma schema generation", "REST API scaffolding", "Community support"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Starter */}
            <div className="glass-card p-8 border-indigo-600/50 glow-indigo-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-slate-400 text-sm mb-6">For indie devs shipping real products.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$29</span>
                <span className="text-slate-400 text-sm ml-2">/ month</span>
              </div>
              <Link href="/pricing" className="btn-primary w-full flex items-center justify-center gap-2 mb-8">
                Get Starter
                <ArrowRight className="w-4 h-4" />
              </Link>
              <ul className="space-y-3">
                {["50 app generations / month", "Unlimited entities per app", "Full 1:N & M:N relation support", "AI relation detection", "Docker & CI/CD configs", "Email support (48h)"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Pro */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
              <p className="text-slate-400 text-sm mb-6">For teams and agencies building at scale.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$99</span>
                <span className="text-slate-400 text-sm ml-2">/ month</span>
              </div>
              <Link href="/pricing" className="btn-ghost w-full flex items-center justify-center gap-2 mb-8">
                Get Pro
              </Link>
              <ul className="space-y-3">
                {["Unlimited app generations", "Everything in Starter", "Priority generation queue", "Advanced AI fine-tuning", "Team collaboration", "Priority support (4h)"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Secure Payment Strip ── */}
      <section className="py-10 px-4 border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            Secure Payment
          </p>
          <div className="flex items-center gap-4 px-6 py-3 rounded-xl bg-slate-900/60 border border-slate-700/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/payment/iyzico-logo-band-white.svg"
              alt="iyzico"
              className="h-7 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-xs text-slate-600">
            Payments are processed securely via iyzico virtual POS
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
