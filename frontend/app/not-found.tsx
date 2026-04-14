import Link from "next/link";
import { Zap, ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-[#0a0b14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">PromptForge</span>
          </Link>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl w-full text-center">

          {/* Terminal window */}
          <div className="glass-card mb-10 overflow-hidden text-left">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex items-center gap-2 ml-3 text-slate-500 text-xs">
                <Terminal className="w-3.5 h-3.5" />
                promptforge ~ hata
              </div>
            </div>
            <div className="p-6 font-mono text-sm space-y-2">
              <p>
                <span className="text-indigo-400">$</span>
                <span className="text-slate-300"> forge generate </span>
                <span className="text-yellow-400">--path &quot;/bu-sayfa&quot;</span>
              </p>
              <p className="text-red-400">✗ Hata: Sayfa şeması bulunamadı</p>
              <p className="text-slate-500">  at Router.resolve (/promptforge/src/router.ts:404)</p>
              <p className="text-slate-500">  at PageGenerator.build (/promptforge/src/generator.ts:12)</p>
              <p />
              <p className="text-slate-400">
                <span className="text-yellow-400">!</span>
                {" "}Bu sayfa henüz oluşturulmadı.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-400">$</span>
                <span className="text-slate-300 animate-pulse">█</span>
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 mb-4">
              <span className="text-3xl font-black text-indigo-400">404</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Bu sayfa henüz forge edilmedi</h1>
            <p className="text-slate-400 max-w-md mx-auto">
              Aradığın sayfa mevcut değil ya da taşınmış olabilir. Seni doğru yere götürelim.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn-primary flex items-center gap-2 px-6 py-3">
              <Zap className="w-4 h-4" />
              Ana sayfaya dön
            </Link>
            <Link href="/dashboard" className="btn-ghost flex items-center gap-2 px-6 py-3">
              <ArrowLeft className="w-4 h-4" />
              Dashboard&apos;a git
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm mb-4">Ya da bu sayfalardan birine gidebilirsin</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: "Ana Sayfa", href: "/" },
                { label: "Fiyatlandırma", href: "/pricing" },
                { label: "Dökümanlar", href: "/docs" },
                { label: "Destek", href: "/support" },
                { label: "İletişim", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white text-sm transition-colors border border-slate-700/50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
