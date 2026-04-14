"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeadphonesIcon,
  Mail,
  MessageCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

const faqs = [
  {
    q: "Üretilen kod gerçekten çalışıyor mu?",
    a: "Evet. PromptForge; Prisma şeması, CRUD API'leri, auth modülü, Dockerfile ve README dahil olmak üzere eksiksiz, çalıştırılabilir bir NestJS projesi üretir. İndirin, npm install çalıştırın, hazır.",
  },
  {
    q: "Kaç entity destekleniyor?",
    a: "Ücretsiz plan, uygulama başına en fazla 5 entity'yi destekler. Starter sınırsız entity sunar. Entity sayısı, kaç dosya ve modül üretileceğini doğrudan etkiler.",
  },
  {
    q: "Hangi veritabanı kullanılıyor?",
    a: "Tüm planlar Prisma ORM ile PostgreSQL kullanır. Üretilen docker-compose.yml, geliştirme için yerel bir PostgreSQL container'ını otomatik olarak ayarlar.",
  },
  {
    q: "Railway deploy çalışmıyor — ne yapmalıyım?",
    a: "Önce RAILWAY_API_TOKEN'ınızın doğru ayarlandığından emin olun. railway.app → Hesap → API Token'ları bölümünden bir token oluşturabilirsiniz. Ardından Dashboard → Ayarlar bölümüne yapıştırın.",
  },
  {
    q: "Aboneliğimi nasıl iptal ederim?",
    a: 'Dashboard → Ayarlar → Abonelik bölümüne gidin ve "Aboneliği İptal Et" düğmesine tıklayın. İptal, mevcut fatura döneminin sonunda geçerli olur.',
  },
  {
    q: "Üretilen kodu ticari bir projede kullanabilir miyim?",
    a: "Kesinlikle. Üretilen kodun %100'ü size aittir. Herhangi bir lisans kısıtlaması veya telif hakkı yoktur.",
  },
  {
    q: "Türkçe prompt yazabilir miyim?",
    a: "Evet — PromptForge, Türkçe dahil çoğu büyük dilde yazılan promptları anlayabilir. Üretilen kod, yorumlar ve değişken adları her zaman İngilizce olacaktır.",
  },
  {
    q: "Üretim limitim ne zaman sıfırlanıyor?",
    a: "Limitler, her fatura döneminin başında otomatik olarak sıfırlanır. Sıfırlama tarihi, takvim ayına değil abonelik başlangıç tarihinize göre belirlenir.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      // Fallback: open email client
      const mailtoLink = `mailto:hello@promptforgeai.dev?subject=${encodeURIComponent(`Support request from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailtoLink;
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <AnnouncementBanner />
      <LandingNav />
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center mx-auto mb-4">
            <HeadphonesIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Yardım & Destek</h1>
          <p className="text-slate-400">
            Aradığınız cevabı bulamadınız mı? Bize ulaşın, en kısa sürede yanıt verelim.
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link
            href="/docs"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Dokümantasyon</p>
              <p className="text-slate-400 text-xs mt-0.5">Rehberler ve kullanım ipuçları</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
          </Link>

          <a
            href="mailto:hello@promptforgeai.dev"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">E-posta Desteği</p>
              <p className="text-slate-400 text-xs mt-0.5">hello@promptforgeai.dev</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
          </a>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-400" />
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-700/60 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors"
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4 bg-slate-900/60 border-t border-slate-700/40">
                    <p className="text-sm text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Bize mesaj gönderin</h2>
          <p className="text-slate-400 text-sm mb-6">
            Yukarıda aradığınız cevabı bulamadınız mı? Formu doldurun, 24 saat içinde yanıt verelim.
          </p>

          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
              <p className="text-white font-medium">Mesajınız alındı!</p>
              <p className="text-slate-400 text-sm mt-1">
                <strong>{email}</strong> adresine en kısa sürede geri döneceğiz.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                    Adınız
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ad Soyad"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                    E-posta adresi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="siz@ornek.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                  Mesaj
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Sorununuzu veya sorunuzu detaylı şekilde açıklayın..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {sending ? "Gönderiliyor..." : "Mesaj gönder"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
