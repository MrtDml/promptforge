import type { Metadata } from "next";
import Link from "next/link";
import { Zap, CheckCircle2, Layers, Code2, Shield } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const leftPanelFeatures = [
  {
    icon: Zap,
    title: "Generate in minutes",
    desc: "From plain English to production-ready NestJS backend in under 5 minutes.",
  },
  {
    icon: Layers,
    title: "Complete stack output",
    desc: "Prisma schema, REST API, auth, Docker, CI/CD — everything included.",
  },
  {
    icon: Code2,
    title: "Clean, readable code",
    desc: "Proper DTOs, validation, auth guards — not just toy scaffolding.",
  },
  {
    icon: Shield,
    title: "Auth built-in",
    desc: "JWT authentication and role-based access control out of the box.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (branding) — hidden on mobile ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-shrink-0 flex-col relative overflow-hidden bg-slate-950">
        {/* Gradient decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_60%)]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group mb-16">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              PromptForge
            </span>
          </Link>

          {/* Headline */}
          <div className="mb-12">
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Ship your SaaS in{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                minutes,
              </span>
              <br />
              not months.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Turn a plain-English description into a complete, production-ready
              backend. No boilerplate. No manual setup.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-5 mb-auto">
            {leftPanelFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800/40 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{f.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-12 pt-8 border-t border-slate-800/60">
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "12K+", label: "Apps generated" },
                { value: "< 5min", label: "Avg. build time" },
                { value: "98%", label: "Satisfaction" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form area) ── */}
      <div className="flex-1 flex flex-col bg-[#080910] relative">
        {/* Mobile header */}
        <header className="lg:hidden p-5 border-b border-slate-800/60">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              PromptForge
            </span>
          </Link>
        </header>

        {/* Form content */}
        <main className="flex-1 flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-[420px]">
            {/* Subtle background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
            </div>
            <div className="relative">{children}</div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-5 py-5 border-t border-slate-800/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[420px] mx-auto sm:max-w-none">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} PromptForge. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
