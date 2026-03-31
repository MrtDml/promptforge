import type { Metadata } from "next";
import Link from "next/link";
import { Zap, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const features = [
  "From plain English to production-ready backend",
  "Prisma, REST API, auth, Docker — all included",
  "JWT auth and role-based access control built-in",
  "Ship your SaaS in minutes, not months",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — full image with overlay ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-shrink-0 relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full w-full p-10 xl:p-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              PromptForge
            </span>
          </Link>

          {/* Bottom content */}
          <div className="mt-auto">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Ship your SaaS in{" "}
              <span className="text-indigo-400">minutes,</span>
              <br />
              not months.
            </h2>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Turn a plain-English description into a complete,
              production-ready backend. No boilerplate. No manual setup.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right panel (form area) ── */}
      <div className="flex-1 flex flex-col bg-[#0d0e18] relative">
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
        <main className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[420px]">
            <div className="relative">{children}</div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-5 border-t border-slate-800/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[420px] mx-auto sm:max-w-none">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} PromptForge. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
