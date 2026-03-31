"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeadphonesIcon,
  Mail,
  MessageCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

const faqs = [
  {
    q: "Does the generated code actually work?",
    a: "Yes. PromptForge generates a complete, runnable NestJS project — including Prisma schema, CRUD APIs, auth module, Dockerfile, and README. Download it, run npm install, and it's ready to go.",
  },
  {
    q: "How many entities are supported?",
    a: "The Free plan supports up to 5 entities per app. Starter supports unlimited entities. The number of entities directly affects how many files and modules are generated.",
  },
  {
    q: "Which database does it use?",
    a: "All plans use PostgreSQL with Prisma ORM. The generated docker-compose.yml automatically sets up a local PostgreSQL container for development.",
  },
  {
    q: "Railway deploy isn't working — what should I do?",
    a: "First, make sure your RAILWAY_API_TOKEN is correctly set. You can generate a token at railway.app → Account → API Tokens. Then paste it into Dashboard → Settings.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Dashboard → Settings → Subscription and click \"Cancel Subscription\". Cancellation takes effect at the end of your current billing period.",
  },
  {
    q: "Can I use the generated code in a commercial project?",
    a: "Absolutely. You own 100% of the generated code. There are no licensing restrictions or royalties of any kind.",
  },
  {
    q: "Can I write prompts in languages other than English?",
    a: "Yes — PromptForge understands prompts in most major languages. Generated code, comments, and variable names will always be in English.",
  },
  {
    q: "When does my generation limit reset?",
    a: "Limits reset automatically at the start of each billing cycle. The reset date is based on your subscription start date, not the calendar month.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      // Fallback: open email client
      const mailtoLink = `mailto:support@promptforgeai.dev?subject=${encodeURIComponent(`Support request from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailtoLink;
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnnouncementBanner />
      <LandingNav />
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center mx-auto mb-4">
            <HeadphonesIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Help & Support</h1>
          <p className="text-slate-400">
            Can&apos;t find an answer? Reach out and we&apos;ll get back to you quickly.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link
            href="/docs"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Documentation</p>
              <p className="text-slate-400 text-xs mt-0.5">Guides and usage tips</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
          </Link>

          <a
            href="mailto:support@promptforgeai.dev"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Email Support</p>
              <p className="text-slate-400 text-xs mt-0.5">support@promptforgeai.dev</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
          </a>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-700/60 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors"
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/40">
                    <p className="text-sm text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Send us a message</h2>
          <p className="text-slate-400 text-sm mb-6">
            Didn&apos;t find an answer above? Fill in the form and we&apos;ll respond within 24 hours.
          </p>

          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
              <p className="text-white font-medium">Message received!</p>
              <p className="text-slate-400 text-sm mt-1">
                We&apos;ll get back to you at <strong>{email}</strong> as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {sending ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
