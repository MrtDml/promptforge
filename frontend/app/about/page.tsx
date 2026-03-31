import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Globe2, Code2, Users, Lightbulb, ArrowRight } from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "About Us — Nexlora Technologies | Prompt Forge",
  description:
    "Prompt Forge is a product of Nexlora Technologies — a global software & AI consultancy on a mission to make software creation accessible to everyone.",
  openGraph: {
    title: "About Nexlora Technologies — The company behind Prompt Forge",
    description:
      "Nexlora Technologies builds AI-powered developer tools. Prompt Forge is our flagship product — turn any idea into production-ready code in minutes.",
  },
};

const VALUES = [
  {
    icon: Lightbulb,
    title: "Accessibility",
    body: "Great software shouldn't require a team of engineers. We build tools that empower anyone — entrepreneur, product manager, or solo developer — to ship production-ready code.",
  },
  {
    icon: Globe2,
    title: "Global reach",
    body: "We build for the world. Our products are used by developers across five continents, and we design every feature with a global, diverse audience in mind.",
  },
  {
    icon: Code2,
    title: "Engineering quality",
    body: "Every line of code we generate meets production standards: tested, secure, and maintainable. We believe AI assistance should raise quality, not lower it.",
  },
  {
    icon: Users,
    title: "Customer success",
    body: "We succeed when our customers succeed. From free-tier hobbyists to enterprise teams, we treat every user with the same level of care and responsiveness.",
  },
];

export default function AboutPage() {
  return (
    <>
      <LandingNav />

      <main className="bg-[#0a0b14] min-h-screen">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300 text-xs font-medium tracking-wide">About Nexlora Technologies</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            The company behind{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Prompt Forge
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Nexlora Technologies is a global software & AI consultancy with a single mission: make software
            creation accessible to every person on earth, regardless of technical background.
          </p>
        </section>

        {/* Mission */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-br from-indigo-600/10 to-violet-600/5 border border-indigo-500/20 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">Our mission</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              We believe the best ideas often come from people who can't code — and that's exactly who we build
              for. Nexlora Technologies combines cutting-edge AI research with practical software engineering to
              remove the barrier between idea and product.
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              Prompt Forge is our flagship product: describe your SaaS idea in plain English, and we generate a
              complete, production-ready NestJS + Prisma backend in seconds. No boilerplate, no setup — just
              working code you can ship.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our values</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-[#0f1123] border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product relationship */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[#0f1123] border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                Nexlora Technologies product
              </p>
              <h3 className="text-xl font-bold text-white mb-2">Prompt Forge AI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Like Claude is to Anthropic, Prompt Forge is to Nexlora. Built with the same care and engineering
                rigour we bring to every client engagement.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to build?</h2>
          <p className="text-slate-400 mb-6">Try Prompt Forge free — no credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl font-semibold text-sm transition-colors border border-slate-700"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
