"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, ArrowRight, Menu, X } from "lucide-react";

export default function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              PromptForge
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Blog
            </Link>
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
            >
              Sign in
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: Sign in + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium px-3 py-2"
            >
              Sign in
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 py-3 space-y-1">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors text-sm"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors text-sm"
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors text-sm"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors text-sm"
            >
              Blog
            </Link>
            <div className="pt-2 pb-1 border-t border-slate-800/60 mt-2">
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
