import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Simple header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            PromptForge
          </span>
        </Link>
      </header>

      {/* Auth content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">{children}</div>
        </div>
      </main>

      <footer className="p-6 text-center">
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} PromptForge
        </p>
      </footer>
    </div>
  );
}
