import Link from "next/link";
import { Zap } from "lucide-react";

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">PromptForge</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Turn your SaaS idea into production-ready code in minutes with AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">How it works</Link></li>
              <li><Link href="/pricing" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Documentation</Link></li>
              <li><Link href="/support" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Support</Link></li>
              <li><Link href="/contact" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © {year} PromptForge. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/register" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Get started free →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
