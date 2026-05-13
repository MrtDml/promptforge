"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  Github,
  Twitter,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
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
      const mailtoLink = `mailto:hello@promptforgeai.dev?subject=${encodeURIComponent(
        form.subject || "promptforgeai.dev üzerinden iletişim"
      )}&body=${encodeURIComponent(
        `Ad Soyad: ${form.name}\nE-posta: ${form.email}\n\n${form.message}`
      )}`;
      window.location.href = mailtoLink;
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  const allFilled = form.name.trim() && form.email.trim() && form.message.trim();
  const msgLen = form.message.length;

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100">
      <AnnouncementBanner />
      <LandingNav />

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Glow */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"
        />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Her mesajı okuyoruz
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Konuşalım
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Bir sorunuz, geri bildiriminiz veya ortaklık fikriniz mi var? Genellikle 24 saat içinde
            yanıt veriyoruz.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left: info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">İletişim bilgileri</h2>
              <div className="space-y-5">

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">E-posta</p>
                    <a
                      href="mailto:hello@promptforgeai.dev"
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      hello@promptforgeai.dev
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Telefon</p>
                    <a
                      href="tel:+905426674230"
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      +90 (542) 667 42 30
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp</p>
                    <a
                      href="https://wa.me/905426674230"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                    >
                      WhatsApp ile yaz →
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Adres</p>
                    <p className="text-slate-400 text-sm">Murat Dumlu Bilgi Teknolojileri</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Lalapaşa Mah. 1. Sümbül Sk.
                    </p>
                    <p className="text-slate-500 text-xs">Sünbül Apt. B Blok No: 5 İç Kapı No: 4</p>
                    <p className="text-slate-500 text-xs">Yakutiye / Erzurum, Türkiye</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Çalışma saatleri</p>
                    <p className="text-slate-400 text-sm">Hafta içi: 09:00 – 18:00 (TSİ)</p>
                    <p className="text-slate-500 text-xs mt-0.5">E-posta: 7/24 ulaşılabilir</p>
                  </div>
                </div>

                {/* Support */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Destek merkezi</p>
                    <Link
                      href="/support"
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      Yardım merkezini ziyaret edin →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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
                  Twitter / X
                </a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3 space-y-6">
            {submitted ? (
              <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Mesajınız gönderildi!</h3>
                <p className="text-slate-400 max-w-sm">
                  Mesajınızı aldık;{" "}
                  <span className="text-white">{form.email}</span> adresine 24 saat içinde yanıt
                  vereceğiz.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
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
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Adınız <span className="text-indigo-400">*</span>
                    </label>
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
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      E-posta <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="siz@ornek.com"
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
                    <option value="Genel Soru">Genel Soru</option>
                    <option value="Faturalama ve Abonelik">Faturalama ve Abonelik</option>
                    <option value="Teknik Destek">Teknik Destek</option>
                    <option value="Ortaklık ve Kurumsal">Ortaklık ve Kurumsal</option>
                    <option value="Özellik İsteği">Özellik İsteği</option>
                    <option value="Basın ve Medya">Basın ve Medya</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Mesaj <span className="text-indigo-400">*</span>
                    </label>
                    <span
                      className={`text-xs ${
                        msgLen < 20
                          ? "text-slate-600"
                          : msgLen < 50
                          ? "text-yellow-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {msgLen} / min. 20 karakter
                    </span>
                  </div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    minLength={20}
                    rows={6}
                    placeholder="Ne düşündüğünüzü anlatın..."
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!allFilled || loading || msgLen < 20}
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
                  Tüm mesajlara iş günü içinde 24 saatte yanıt veriyoruz.
                </p>
              </form>
            )}

            {/* OpenStreetMap embed — Yakutiye / Erzurum */}
            <div className="rounded-xl overflow-hidden border border-slate-800">
              <iframe
                title="PromptForge Erzurum Ofis"
                src="https://www.openstreetmap.org/export/embed.html?bbox=41.2481%2C39.8865%2C41.2981%2C39.9265&amp;layer=mapnik&amp;marker=39.9065%2C41.2681"
                width="100%"
                height="220"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
