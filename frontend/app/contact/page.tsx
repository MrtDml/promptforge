"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Clock, CheckCircle2, ArrowRight, Github, Twitter, MapPin, Phone } from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      // Fallback to mailto
      const mailtoLink = `mailto:hello@promptforgeai.dev?subject=${encodeURIComponent(form.subject || "Contact from promptforgeai.dev")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      window.location.href = mailtoLink;
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  const allFilled = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnnouncementBanner />
      <LandingNav />

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Her mesajı okuyoruz
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-indigo-400">Konuşalım</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Bir sorunuz, geri bildiriminiz veya ortaklık fikriniz mi var? Genellikle 24 saat içinde yanıt veriyoruz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left: info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">İletişime geçin</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">E-posta</p>
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
                    <p className="text-sm font-medium text-white">Yanıt süresi</p>
                    <p className="text-slate-400 text-sm">Genellikle 24 saat içinde</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Destek</p>
                    <Link href="/support" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                      Yardım merkezini ziyaret edin →
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Şirket</p>
                    <p className="text-slate-400 text-sm">Dumlu Teknoloji, Yazılım ve Danışmanlık</p>
                    <p className="text-slate-500 text-xs mt-0.5">İstanbul, Türkiye</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Telefon</p>
                    <a href="tel:+902120000000" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                      +90 (212) 000 00 00
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800" />

            {/* Topics */}
            <div>
              <p className="text-sm font-medium text-white mb-4">Size nasıl yardımcı olabiliriz</p>
              <ul className="space-y-2">
                {[
                  "PromptForge hakkında genel sorular",
                  "Faturalama ve abonelik",
                  "Teknik destek",
                  "Ortaklık ve kurumsal",
                  "Özellik istekleri ve geri bildirim",
                  "Basın ve medya sorguları",
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
              <p className="text-sm font-medium text-white mb-3">Bizi çevrimiçi bulun</p>
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
                  href="https://x.com/promptforgeai"
                  target="_blank"
                  rel="noopener noreferrer"
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
                <h3 className="text-2xl font-bold text-white">Mesajınız gönderildi!</h3>
                <p className="text-slate-400 max-w-sm">
                  Mesajınızı aldık; <span className="text-white">{form.email}</span> adresine 24 saat içinde yanıt vereceğiz.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="btn-ghost mt-4 flex items-center gap-2"
                >
                  Başka bir mesaj gönder
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Adınız</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Ad Soyad"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">E-posta adresi</label>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Konu</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  >
                    <option value="">Konu seçin...</option>
                    <option value="General Question">Genel Soru</option>
                    <option value="Billing & Subscription">Faturalama ve Abonelik</option>
                    <option value="Technical Support">Teknik Destek</option>
                    <option value="Partnership & Enterprise">Ortaklık ve Kurumsal</option>
                    <option value="Feature Request">Özellik İsteği</option>
                    <option value="Press & Media">Basın ve Medya</option>
                    <option value="Other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Mesaj</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Ne düşündüğünüzü anlatın..."
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                  />
                  <p className="text-xs text-slate-600 mt-1">{form.message.length} karakter</p>
                </div>

                <button
                  type="submit"
                  disabled={!allFilled || loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Mesaj gönder
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Tüm mesajlara 24 saat içinde yanıt veriyoruz.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
