"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, MessageSquare, Clock, CheckCircle2, ArrowRight, Github, Twitter } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const mailtoLink = `mailto:hello@promptforgeai.dev?subject=${encodeURIComponent(form.subject || "Contact from promptforgeai.dev")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      window.location.href = mailtoLink;
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  const allFilled = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">PromptForge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            We read every message
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Let&apos;s <span className="text-indigo-400">talk</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Have a question, feedback, or partnership idea? We typically respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left: info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Get in touch</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email us</p>
                    <a href="mailto:hello@promptforgeai.dev" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                      hello@promptforgeai.dev
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Response time</p>
                    <p className="text-slate-400 text-sm">Usually within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Support</p>
                    <Link href="/support" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                      Visit help center →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800" />

            {/* Topics */}
            <div>
              <p className="text-sm font-medium text-white mb-4">What we can help with</p>
              <ul className="space-y-2">
                {[
                  "General questions about PromptForge",
                  "Billing and subscription",
                  "Technical support",
                  "Partnership & enterprise",
                  "Feature requests & feedback",
                  "Press & media inquiries",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="border-t border-slate-800 pt-6">
              <p className="text-sm font-medium text-white mb-3">Find us online</p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/MrtDml/promptforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message sent!</h3>
                <p className="text-slate-400 max-w-sm">
                  Your email client should have opened. We&apos;ll get back to you at <span className="text-white">{form.email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="btn-ghost mt-4 flex items-center gap-2"
                >
                  Send another message
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  >
                    <option value="">Select a topic...</option>
                    <option value="General Question">General Question</option>
                    <option value="Billing & Subscription">Billing & Subscription</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership & Enterprise">Partnership & Enterprise</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Press & Media">Press & Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                  />
                  <p className="text-xs text-slate-600 mt-1">{form.message.length} characters</p>
                </div>

                <button
                  type="submit"
                  disabled={!allFilled || loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Opening email client...
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-500 text-center">
                  By submitting this form, your email client will open with the message pre-filled.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">PromptForge</span>
          </Link>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} PromptForge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms</Link>
            <Link href="/contact" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
