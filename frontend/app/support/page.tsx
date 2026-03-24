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

const faqs = [
  {
    q: "Üretilen kod gerçekten çalışıyor mu?",
    a: "Evet. PromptForge eksiksiz bir NestJS projesi üretir — Prisma şeması, CRUD API'leri, auth modülü, Dockerfile ve README dahil. İndirip npm install ile kurabilirsin.",
  },
  {
    q: "Kaç entity destekleniyor?",
    a: "Free planda 5, Starter'da 15, Pro'da sınırsız entity. Entity sayısı arttıkça üretilen dosya sayısı da artar.",
  },
  {
    q: "Hangi veritabanını kullanıyor?",
    a: "Tüm planlar PostgreSQL + Prisma ORM kullanır. Üretilen docker-compose.yml ile yerel geliştirme için otomatik PostgreSQL konteyneri kurulur.",
  },
  {
    q: "Railway deploy çalışmıyor, ne yapmalıyım?",
    a: "Önce RAILWAY_API_TOKEN'ının .env dosyasında doğru ayarlı olduğundan emin ol. Token için railway.app → Account → API Tokens yolunu izle.",
  },
  {
    q: "Planımı nasıl iptal ederim?",
    a: "Dashboard → Settings → Subscription bölümünden 'Aboneliği İptal Et' butonuna tıkla. İptal dönem sonunda geçerli olur.",
  },
  {
    q: "Üretilen kodu ticari projede kullanabilir miyim?",
    a: "Evet, üretilen tüm kodun tam hakları sana aittir. Herhangi bir kullanım kısıtlaması yoktur.",
  },
  {
    q: "Türkçe prompt yazabilir miyim?",
    a: "Evet. PromptForge Türkçe ve İngilizce promptları destekler. Ancak üretilen kodun içindeki yorum ve değişken isimleri İngilizce olur.",
  },
  {
    q: "Generation limiti sıfırlanıyor mu?",
    a: "Evet, her ayın başında otomatik sıfırlanır. Sıfırlama tarihi abonelik başlangıç tarihine göre belirlenir.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // Simüle edilmiş gönderim — gerçek entegrasyon için backend endpoint ekle
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center mx-auto mb-4">
            <HeadphonesIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Yardım & Destek</h1>
          <p className="text-slate-400">
            Sorununu çözemezsen bize ulaş, en kısa sürede dönelim.
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
              <p className="text-slate-400 text-xs mt-0.5">Kullanım rehberi ve ipuçları</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
          </Link>

          <a
            href="mailto:support@promptforge.dev"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">E-posta Desteği</p>
              <p className="text-slate-400 text-xs mt-0.5">support@promptforge.dev</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
          </a>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-400" />
            Sık Sorulan Sorular
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
          <h2 className="text-lg font-semibold mb-1">Bize Yaz</h2>
          <p className="text-slate-400 text-sm mb-6">
            SSS'de cevap bulamadıysan formu doldur, 24 saat içinde dönelim.
          </p>

          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
              <p className="text-white font-medium">Mesajın alındı!</p>
              <p className="text-slate-400 text-sm mt-1">
                En kısa sürede <strong>{email}</strong> adresine dönüş yapacağız.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                    İsim
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Adın"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@ornek.com"
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
                  placeholder="Sorununu veya sorunuzu detaylı anlat..."
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
                  Gönder
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
