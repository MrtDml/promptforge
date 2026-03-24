"use client";

import Link from "next/link";
import {
  BookOpen,
  Terminal,
  Zap,
  Database,
  Download,
  Rocket,
  ChevronRight,
  Code2,
  GitBranch,
  Shield,
} from "lucide-react";

const sections = [
  {
    icon: Zap,
    title: "Hızlı Başlangıç",
    description: "İlk uygulamanı 5 dakikada oluştur.",
    steps: [
      'Dashboard\'a git ve "New Project" butonuna tıkla.',
      "Oluşturmak istediğin uygulamayı doğal dilde açıkla.",
      "AI'ın promptunu analiz etmesini bekle ve şemayı incele.",
      '"Generate" butonuna tıkla — kod üretimi başlar.',
      "Tamamlandığında ZIP olarak indir veya Railway'e deploy et.",
    ],
  },
  {
    icon: Code2,
    title: "Prompt Yazma Rehberi",
    description: "Daha iyi sonuçlar için prompt ipuçları.",
    steps: [
      "Uygulamanın amacını net bir şekilde belirt: 'Bir e-ticaret uygulaması istiyorum'.",
      "Entity'leri say: 'Kullanıcı, Ürün, Sipariş ve Kategori entity'leri olsun'.",
      "Özellikleri belirt: 'JWT auth, CRUD API ve admin paneli olsun'.",
      "İlişkileri tanımla: 'Bir kullanıcının birden fazla siparişi olabilir'.",
      "Teknik tercihlerini ekle: 'PostgreSQL, NestJS ve Prisma kullan'.",
    ],
  },
  {
    icon: Database,
    title: "Üretilen Proje Yapısı",
    description: "PromptForge her proje için neler üretir?",
    steps: [
      "src/ — NestJS uygulama kodu (modüller, controller'lar, servisler).",
      "prisma/schema.prisma — Veritabanı şeması ve migration'lar.",
      "Dockerfile + docker-compose.yml — Konteyner konfigürasyonu.",
      ".env.example — Gerekli ortam değişkenleri şablonu.",
      "README.md — Kurulum ve çalıştırma talimatları.",
    ],
  },
  {
    icon: Download,
    title: "Projeyi İndirme",
    description: "Üretilen kodu bilgisayarına indir.",
    steps: [
      "Proje detay sayfasına git.",
      '"Download ZIP" butonuna tıkla.',
      "ZIP dosyasını aç ve terminalde projeye gir.",
      "npm install komutunu çalıştır.",
      ".env.example dosyasını .env olarak kopyala ve değerleri doldur.",
    ],
  },
  {
    icon: Rocket,
    title: "Railway ile Deploy",
    description: "Tek tıkla buluta deploy et.",
    steps: [
      "Proje detay sayfasındaki 'Deploy to Railway' butonuna tıkla.",
      "Railway hesabın yoksa önce railway.app'te kayıt ol.",
      "RAILWAY_API_TOKEN'ı ayarlardan al ve .env'e ekle.",
      "Deploy işlemi otomatik başlar — PostgreSQL ve app servisi kurulur.",
      "Deploy tamamlandığında canlı URL görünür.",
    ],
  },
  {
    icon: Shield,
    title: "Planlar ve Limitler",
    description: "Her planda neler dahil?",
    steps: [
      "Free: Ayda 3 proje üretimi, temel özellikler.",
      "Starter ($29/ay): Ayda 50 proje üretimi, Railway deploy.",
      "Pro ($99/ay): Sınırsız üretim, öncelikli destek.",
      "Limit aşıldığında plan yükseltme sayfasına yönlendirilirsin.",
      "İptal ettiğinde dönem sonuna kadar plan devam eder.",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold">Dokümantasyon</h1>
          </div>
          <p className="text-slate-400 text-lg">
            PromptForge'u kullanmaya başlamak için ihtiyacın olan her şey.
          </p>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {sections.map((s) => (
            <a
              key={s.title}
              href={`#${s.title}`}
              className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800 transition-all text-sm text-slate-300 hover:text-white"
            >
              <s.icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {s.title}
            </a>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div
              key={section.title}
              id={section.title}
              className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <section.icon className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <p className="text-slate-400 text-sm mb-5">{section.description}</p>
              <ol className="space-y-3">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 text-center">
          <Terminal className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Hâlâ sorun mu var?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Destek ekibimizle iletişime geç, yardımcı olalım.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Destek Al
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
