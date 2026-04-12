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
  Shield,
  Lightbulb,
} from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

const sections = [
  {
    icon: Zap,
    title: "Hızlı Başlangıç",
    description: "5 dakika içinde ilk uygulamanızı geliştirin.",
    steps: [
      'Dashboard\'a gidin ve "Yeni Proje" butonuna tıklayın.',
      "Geliştirmek istediğiniz uygulamayı doğal Türkçe ile tarif edin.",
      "Yapay zekanın açıklamanızı ayrıştırmasını bekleyin ve üretilen şemayı inceleyin.",
      '"Üret" butonuna tıklayın — kod üretimi hemen başlar.',
      "Tamamlandığında ZIP dosyasını indirin veya doğrudan Railway\'e dağıtın.",
    ],
  },
  {
    icon: Lightbulb,
    title: "Etkili Prompt Yazımı",
    description: "PromptForge\'dan en iyi sonuçları almak için ipuçları.",
    steps: [
      'Uygulamanın amacını açıkça belirtin: "Bir e-ticaret platformu istiyorum".',
      'Entity\'lerinizi listeleyin: "Kullanıcılar, Ürünler, Siparişler ve Kategoriler".',
      'Özellikleri belirtin: "JWT kimlik doğrulama, CRUD API\'leri ve yönetim paneli".',
      'İlişkileri tanımlayın: "Bir kullanıcının birden fazla siparişi olabilir; her siparişin birden fazla ürünü olabilir".',
      'Teknoloji tercihlerini ekleyin: "PostgreSQL, NestJS ve Prisma kullan".',
    ],
  },
  {
    icon: Code2,
    title: "Prompt Örnekleri",
    description: "Kendi projeleriniz için başlangıç noktası olarak kullanabilirsiniz.",
    steps: [
      '"Kullanıcılar, Takımlar ve Görevler içeren bir görev yönetim uygulaması geliştir. JWT kimlik doğrulama, takım davetleri ve görev atamaları olsun."',
      '"Yazarlar, Yazılar, Kategoriler ve Yorumlar içeren bir blog platformu oluştur. Markdown desteği ve rol tabanlı erişim kontrolü dahil olsun."',
      '"Müşteriler, Hizmetler, Randevular ve Ödemeler içeren bir rezervasyon sistemi istiyorum. E-posta bildirimleri dahil olsun."',
      '"Ürünler, Depolar ve Stok Hareketleri içeren bir envanter takip sistemi geliştir. Düşük stok uyarıları ve CSV dışa aktarma özelliği olsun."',
      '"Kurslar, Dersler, Kayıtlar ve Sınavlar içeren bir eğitim platformu oluştur. İlerleme takibi ve sertifika desteği olsun."',
    ],
  },
  {
    icon: Database,
    title: "Üretilen Proje Yapısı",
    description: "PromptForge her proje için neler üretir.",
    steps: [
      "src/ — Tam NestJS uygulaması (modüller, controller'lar, servisler, guard'lar).",
      "prisma/schema.prisma — Tüm entity'ler ve ilişkilerle birlikte veritabanı şeması.",
      "Dockerfile + docker-compose.yml — Kullanıma hazır container yapılandırması.",
      ".env.example — Gerekli tüm ortam değişkenleri için şablon.",
      "README.md — Adım adım kurulum ve çalıştırma talimatları.",
    ],
  },
  {
    icon: Download,
    title: "Kodunuzu İndirme",
    description: "Üretilen kodu bilgisayarınıza alın.",
    steps: [
      "Dashboard'dan proje detay sayfasını açın.",
      '"ZIP İndir" butonuna tıklayın.',
      "ZIP\'i çıkartın ve proje klasöründe bir terminal açın.",
      "Bağımlılıkları yüklemek için npm install komutunu çalıştırın.",
      ".env.example dosyasını .env olarak kopyalayın ve değerleri doldurun (veritabanı URL'si, JWT anahtarı vb.).",
    ],
  },
  {
    icon: Rocket,
    title: "Railway'e Dağıtım",
    description: "Tek tıkla bulut dağıtımı — DevOps gerektirmez.",
    steps: [
      'Proje detay sayfasını açın ve "Railway\'e Dağıt" butonuna tıklayın.',
      "Hesabınız yoksa railway.app adresinde kaydolun.",
      "Bir Railway API token oluşturun (Hesap → Token'lar) ve PromptForge ayarlarınıza yapıştırın.",
      "Dağıtım otomatik başlar — Railway PostgreSQL ve uygulama servisini hazırlar.",
      "Tamamlandığında canlı URL'niz proje sayfasında görünür.",
    ],
  },
  {
    icon: Shield,
    title: "Planlar ve Limitler",
    description: "Her plana dahil olanlar.",
    steps: [
      "Ücretsiz: Ayda 3 proje üretimi — denemek için idealdir.",
      "Starter (₺950/ay): Ayda 50 üretim + Railway dağıtım desteği.",
      "Pro (₺3.250/ay): Sınırsız üretim + öncelikli destek.",
      "Limitinize ulaştığınızda plan yükseltme ekranına yönlendirilirsiniz.",
      "İptal etmeniz durumunda mevcut planınız fatura döneminin sonuna kadar aktif kalır.",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnnouncementBanner />
      <LandingNav />
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
            PromptForge ile başlamak için ihtiyacınız olan her şey.
          </p>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
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
                    <span className="text-slate-300 text-sm font-mono leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 text-center">
          <Terminal className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Hâlâ takıldınız mı?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Destek ekibimiz daha hızlı geliştirmeniz için burada.
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
      <LandingFooter />
    </div>
  );
}
