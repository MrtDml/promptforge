import type { Metadata } from "next";
import Link from "next/link";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur | Tek Prompttan Backend",
  description:
    "PromptForge, SaaS fikrinizi 5 dakika içinde üretime hazır koda dönüştürür. Tek prompttan eksiksiz NestJS backend, Prisma şeması, REST API ve Docker kurulumu. Ücretsiz deneyin.",
  keywords: [
    "promptforge",
    "prompt forge",
    "yapay zeka kod üretici",
    "AI SaaS oluşturucu",
    "AI ile SaaS geliştir",
    "prompttan SaaS üret",
    "NestJS generator",
    "Prisma şema üretici",
    "REST API generator",
    "no-code backend",
    "AI uygulama oluşturucu",
    "SaaS boilerplate generator",
    "Lovable alternatif",
    "Bolt.new alternatif",
    "v0 alternatif",
    "yapay zeka geliştirici aracı",
  ],
  alternates: { canonical: "https://promptforgeai.dev" },
  openGraph: {
    title: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur",
    description:
      "SaaS fikrinizi 5 dakika içinde üretime hazır koda dönüştürün. NestJS backend, Prisma şeması, REST API, Docker — hepsi tek bir prompttan.",
    url: "https://promptforgeai.dev",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge – Yapay Zeka ile SaaS Uygulaması Oluştur",
    description:
      "SaaS fikrinizi 5 dakika içinde üretime hazır koda dönüştürün. Ücretsiz deneyin.",
    images: ["/twitter-image"],
  },
};
import AnnouncementBanner from "@components/layout/AnnouncementBanner";
import {
  ArrowRight,
  Zap,
  Code2,
  Database,
  Shield,
  Layers,
  Terminal,
  ChevronRight,
  CheckCircle2,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Anında Üretim",
    description:
      "SaaS fikrinizi düz Türkçe olarak tarif edin ve saniyeler içinde eksiksiz, çalışan bir uygulama edinin.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Database,
    title: "Akıllı Şema Tasarımı",
    description:
      "Veritabanı şemanızı uygun ilişkiler, indeksler ve kısıtlamalarla otomatik olarak tasarlar.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Code2,
    title: "Full-Stack Kod",
    description:
      "REST API'leri, veritabanı migration'larını ve frontend bileşenlerini tek bir prompttan üretir.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Shield,
    title: "Dahili Kimlik Doğrulama",
    description:
      "Üretilen her uygulama; JWT kimlik doğrulama, rol tabanlı erişim kontrolü ve güvenlik en iyi uygulamalarıyla birlikte gelir.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Layers,
    title: "Üretime Hazır",
    description:
      "Üretilen kod; Docker, CI/CD yapılandırmaları ve ortam yönetimiyle endüstri standartlarını takip eder.",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    icon: Terminal,
    title: "Geliştirici Dostu",
    description:
      "Kapsamlı README, API dokümantasyonu ve kurulum talimatlarıyla birlikte temiz, okunabilir kod.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Uygulamanızı Tarif Edin",
    description:
      "Geliştirmek istediğiniz SaaS ürününün doğal dil açıklamasını yazın.",
  },
  {
    number: "02",
    title: "Yapay Zeka Niyetinizi Anlar",
    description:
      "Yapay zekamız, açıklamanızdan varlıkları, ilişkileri, endpoint'leri ve özellikleri çıkarır.",
  },
  {
    number: "03",
    title: "Şemayı İnceleyin",
    description:
      "Üretmeden önce oluşturulan veri modelini, API tasarımını ve uygulama mimarisini önizleyin.",
  },
  {
    number: "04",
    title: "Üret ve İndir",
    description:
      "Tüm stack için üretime hazır kodu edinin; yerel olarak çalıştırmaya veya buluta dağıtmaya hazır.",
  },
];


const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dumlu Teknoloji, Yazılım ve Danışmanlık",
  alternateName: "PromptForge",
  url: "https://promptforgeai.dev",
  logo: "https://promptforgeai.dev/opengraph-image",
  email: "info@promptforgeai.dev",
  telephone: "+905426674230",
  description: "Yapay zeka destekli SaaS oluşturucu — tek prompttan üretime hazır NestJS backend üretin.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "TepeTepe Prime İş ve Yaşam Merkezi, Mustafa Kemal Mah. Dumlupınar Bulvarı",
    addressLocality: "Çankaya",
    addressRegion: "Ankara",
    addressCountry: "TR",
  },
  sameAs: [
    "https://github.com/MrtDml/promptforge",
    "https://twitter.com/promptforgeai",
  ],
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PromptForge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://promptforgeai.dev",
  inLanguage: "tr-TR",
  offers: [
    { "@type": "Offer", name: "Ücretsiz", price: "0", priceCurrency: "TRY", description: "Kredi kartı gerekmez — ayda 3 üretim hakkı" },
    { "@type": "Offer", name: "Starter", price: "950", priceCurrency: "TRY", description: "Ayda 50 üretim, sınırsız varlık" },
    { "@type": "Offer", name: "Pro", price: "3250", priceCurrency: "TRY", description: "Sınırsız üretim, öncelikli kuyruk, tüm özellikler" },
  ],
  description: "SaaS fikrinizi 5 dakika içinde üretime hazır NestJS + Prisma + Docker koduna dönüştürün.",
  featureList: [
    "Yapay zeka destekli şema üretimi",
    "NestJS kod üretimi",
    "Prisma ORM ve migration'lar",
    "JWT kimlik doğrulama",
    "Docker ve CI/CD yapılandırması",
    "Tek tıkla Railway dağıtımı",
    "AI kod asistanı sohbeti",
    "GitHub entegrasyonu",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "PromptForge nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PromptForge, Türkçe açıklamanızı eksiksiz, üretime hazır bir NestJS veya Express.js SaaS backend'ine dönüştüren yapay zeka destekli bir kod üreticisidir. Prisma şeması, REST API'leri, JWT kimlik doğrulama, Docker yapılandırması ve daha fazlasını içerir.",
      },
    },
    {
      "@type": "Question",
      name: "Uygulama üretmek ne kadar sürer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Çoğu uygulama 5 dakika içinde üretilir. Yapay zeka promptunuzu analiz eder, veri modelini tasarlar ve tüm kodu anında yazar.",
      },
    },
    {
      "@type": "Question",
      name: "Üretilen kod bana mı ait?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Üretilen tüm kod %100 sizindir. Vendor lock-in yoktur, özel çalışma zamanı yoktur ve uygulamanızı çalıştırmak için süregelen bir ücret yoktur. İstediğiniz yere indirin ve dağıtın.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi framework'ler destekleniyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PromptForge; dekoratörler, bağımlılık enjeksiyonu ve modüller içeren NestJS'i destekler. Her ikisi de Prisma ORM ve PostgreSQL içerir.",
      },
    },
    {
      "@type": "Question",
      name: "Ücretsiz plan var mı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Ücretsiz plan, en fazla 5 varlıkla ayda 3 uygulama üretimi içerir. Kredi kartı gerekmez. Ücretli planlar 50 üretim ve sınırsız varlık için aylık ₺950'den başlar.",
      },
    },
    {
      "@type": "Question",
      name: "Kodlama bilgisi gerekiyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. Sadece uygulamanızı Türkçe olarak tarif edin — varlıklar, özellikler ve gereksinimler. PromptForge gerisini halleder. Ancak üretilen kodu özelleştirmek istiyorsanız geliştirici bilgisi avantaj sağlar.",
      },
    },
    {
      "@type": "Question",
      name: "Üretilen kodu nasıl dağıtabilirim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ZIP olarak indirebilir, tek tıkla GitHub reponuza gönderebilir veya doğrudan PromptForge dashboard'undan Railway'e dağıtabilirsiniz.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "PromptForge ile SaaS Uygulaması Nasıl Oluşturulur",
  description: "Yapay zeka destekli PromptForge ile tek bir prompttan üretime hazır SaaS backend oluşturun.",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      name: "Uygulamanızı Tanımlayın",
      text: "Geliştirmek istediğiniz SaaS ürününü sade Türkçe ile tarif edin — varlıklar, özellikler ve gereksinimler. Kodlama bilgisi gerekmez.",
      url: "https://promptforgeai.dev/#how-it-works",
    },
    {
      "@type": "HowToStep",
      name: "Yapay Zeka Şemayı Üretir",
      text: "PromptForge, açıklamanızdan varlıkları, ilişkileri ve API endpoint'lerini çıkararak veri modelini otomatik tasarlar.",
      url: "https://promptforgeai.dev/#how-it-works",
    },
    {
      "@type": "HowToStep",
      name: "Şemayı İnceleyin",
      text: "Üretmeden önce oluşturulan veri modelini, API tasarımını ve uygulama mimarisini önizleyin ve onaylayın.",
      url: "https://promptforgeai.dev/#how-it-works",
    },
    {
      "@type": "HowToStep",
      name: "İndirin ve Dağıtın",
      text: "ZIP olarak indirin, GitHub'a gönderin veya tek tıkla Railway'e dağıtın. Uygulama tamamen hazır.",
      url: "https://promptforgeai.dev/#how-it-works",
    },
  ],
};

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── JSON-LD Structured Data ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {/* ── Announcement Banner ── */}
      <AnnouncementBanner />
      {/* ── Navbar ── */}
      <LandingNav />

      {/* ── Hero ── */}
      <section className="hero-bg pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300 text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Prompt Forge — AI SaaS Code Generator
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            SaaS uygulamanı{" "}
            <span className="gradient-text">tek cümleyle geliştir</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            <strong className="text-slate-300">Prompt Forge</strong>, doğal dil açıklamanızı eksiksiz, üretime hazır bir SaaS uygulamasına — backend, veritabanı şeması, API&apos;ler ve daha fazlasına — dönüştürür.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="btn-primary text-base px-8 py-3.5 glow-indigo"
            >
              Ücretsiz geliştirmeye başla
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-base px-8 py-3.5"
            >
              Dashboard&apos;a giriş yap
            </Link>
          </div>

          {/* Demo prompt preview */}
          <div className="glass-card max-w-3xl mx-auto p-6 text-left glow-indigo-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-slate-500 text-xs font-mono">promptforge.dev</span>
            </div>
            <p className="text-slate-300 text-sm font-mono mb-4 leading-relaxed">
              <span className="text-indigo-400">$</span>{" "}
              <span className="text-slate-200">
                &quot;Takımlar, görevler, yorumlar, dosya ekleri ve rol tabanlı
                erişim kontrolüne sahip çok kiracılı bir proje yönetim SaaS&apos;ı
                geliştir. Ücretsiz ve pro katmanlı abonelik sistemi dahil.&quot;
              </span>
            </p>
            <div className="border-t border-slate-700/60 pt-4">
              <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                14 entity üretildi · 42 API endpoint · 18 dosya · Docker hazır
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Daha hızlı çıkarmanız için ihtiyacınız olan her şey
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              PromptForge tüm iskelet kurulum sürecini üstlenir; siz ürününüzü özel kılan şeylere odaklanırsınız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:border-slate-600/80 transition-all duration-300 group"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nasıl çalışır?</h2>
            <p className="text-slate-400 text-lg">
              Fikirden koda dört basit adımda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-5">
                <div className="flex-shrink-0">
                  <span className="text-4xl font-black text-indigo-600/40 font-mono">
                    {step.number}
                  </span>
                </div>
                <div className={`pt-1 ${i < steps.length - 1 ? "border-b border-slate-800 pb-8 md:border-0 md:pb-0" : ""}`}>
                  <h3 className="font-semibold text-xl text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why PromptForge ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              Ekiplerin{" "}
              <span className="gradient-text">PromptForge</span>&apos;u tercih etme nedeni
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Diğer yapay zeka araçları oyuncak kod üretir. PromptForge, mühendislerinizin gerçekten çıkarabileceği üretim kalitesinde mimari oluşturur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Zap,
                title: "Manuel geliştirmeden 10 kat hızlı",
                description:
                  "Deneyimli bir mühendise 2 gün süren iskelet kurulumu — entity'ler, ilişkiler, endpoint'ler, auth, Docker — PromptForge ile 5 dakika altında hazır.",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
                badge: "Hız",
              },
              {
                icon: Code2,
                title: "Gerçek, temiz kod",
                description:
                  "Düzgün NestJS modülleri, DTO'lar, Zod doğrulaması, auth guard'ları, Prisma migration'ları — oyuncak iskelet değil. Mühendisler yeniden yazmaz, doğrudan çıkarır.",
                color: "text-green-400",
                bg: "bg-green-400/10",
                badge: "Kalite",
              },
              {
                icon: FileText,
                title: "Kod sizin",
                description:
                  "Üretilen her dosya size aittir. Vendor bağımlılığı yok, özel çalışma ortamı yok, uygulamanızı çalıştırmak için aylık ücret yok. İndirin ve istediğiniz yere dağıtın.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                badge: "Sahiplik",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card p-6 hover:border-slate-600/80 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Comparison callout */}
          <div className="glass-card p-6 md:p-8 border-indigo-600/30 bg-indigo-950/20">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  PromptForge vs. alternatifler
                </h3>
                <p className="text-slate-400 text-sm">
                  Lovable, Bolt ve v0, UI prototipleme için harika araçlar. PromptForge ise mockup değil, üretime hazır API ihtiyacı duyan backend-first ekipler için tasarlandı.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:w-80">
                {[
                  { label: "Tam backend çıktısı", pf: true, others: false },
                  { label: "Prisma + migration'lar", pf: true, others: false },
                  { label: "Kod size ait", pf: true, others: "partial" },
                  { label: "Vendor bağımlılığı yok", pf: true, others: false },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="bg-slate-800/60 rounded-lg px-3 py-2 flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-300 text-xs">{row.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-green-400 text-xs font-bold">✓</span>
                      <span className="text-red-400 text-xs">
                        {row.others === false ? "✗" : "~"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── What is Prompt Forge ── (SEO anchor section) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            <span className="gradient-text">Prompt Forge</span> nedir?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-400 text-base leading-relaxed">
            <div>
              <p className="mb-4">
                <strong className="text-slate-200">Prompt Forge</strong>, SaaS ürünlerini daha hızlı çıkarmak isteyen geliştiriciler ve startup kurucuları için tasarlanmış yapay zeka destekli bir kod üretim platformudur. Şablon kod yazmak için günler harcamak yerine, uygulamanızı doğal dille tarif edersiniz ve Prompt Forge tüm backend yığınını sizin için oluşturur.
              </p>
              <p>
                Prompt Forge motoru, doğal dil açıklamanızı ayrıştırır; entity&apos;leri, ilişkileri ve özellikleri tespit eder, ardından NestJS modülleri, Prisma veritabanı şeması, REST endpoint&apos;leri, JWT kimlik doğrulama, Docker yapılandırması ve daha fazlasını içeren eksiksiz bir proje üretir.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Genel amaçlı yapay zeka araçlarının aksine, <strong className="text-slate-200">Prompt Forge</strong> backend geliştirme için özel olarak tasarlanmıştır. Ürettiği her dosya; uygun hata yönetimi, girdi doğrulaması, rol tabanlı erişim kontrolü ve ölçeklenebilir mimari desenleriyle üretim en iyi uygulamalarını takip eder.
              </p>
              <p>
                Prompt Forge, bir SaaS fikrinden çalışan koda geçmenin en hızlı yoludur. Ekipler onu saatler içinde prototip oluşturmak, geliştirme döngülerini hızlandırmak ve proje projeden aynı altyapı desenlerini kurmanın tekrarlayan işinden kaçınmak için kullanır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Sade ve şeffaf fiyatlandırma</h2>
            <p className="text-slate-400 text-lg">Ücretsiz başla. İhtiyacın arttıkça yükselt.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <div className="glass-card p-8 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-1">Ücretsiz</h3>
              <p className="text-slate-400 text-sm mb-6">Deneyin, kredi kartı gerekmez.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">Ücretsiz</span>
              </div>
              <Link href="/register" className="btn-ghost w-full flex items-center justify-center gap-2 mb-8">
                Ücretsiz başla
              </Link>
              <ul className="space-y-3 flex-1">
                {["Ayda 3 uygulama üretimi", "Uygulama başına en fazla 5 entity", "Prisma şema üretimi", "REST API iskelet oluşturma", "Topluluk desteği"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Starter */}
            <div className="glass-card p-8 border-indigo-600/50 glow-indigo-lg relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">En Popüler</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-slate-400 text-sm mb-6">Gerçek ürün çıkaran bağımsız geliştiriciler için.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₺950</span>
                <span className="text-slate-400 text-sm ml-2">/ ay</span>
              </div>
              <Link href="/pricing" className="btn-primary w-full flex items-center justify-center gap-2 mb-8">
                Starter&apos;a Geç
                <ArrowRight className="w-4 h-4" />
              </Link>
              <ul className="space-y-3 flex-1">
                {["Ayda 50 uygulama üretimi", "Sınırsız entity", "Tam 1:N ve M:N ilişki desteği", "AI ilişki algılama", "Docker ve CI/CD yapılandırmaları", "E-posta desteği (48 saat)"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Pro */}
            <div className="glass-card p-8 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
              <p className="text-slate-400 text-sm mb-6">Ölçekte üretim yapan ekipler ve ajanslar için.</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₺3.250</span>
                <span className="text-slate-400 text-sm ml-2">/ ay</span>
              </div>
              <Link href="/pricing" className="btn-ghost w-full flex items-center justify-center gap-2 mb-8">
                Pro&apos;ya Geç
              </Link>
              <ul className="space-y-3 flex-1">
                {["Sınırsız uygulama üretimi", "Starter&apos;daki her şey", "Öncelikli üretim kuyruğu", "Gelişmiş AI fine-tuning", "Takım işbirliği", "Öncelikli destek (4 saat)"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Secure Payment Strip ── */}
      <section className="py-10 px-4 border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            Güvenli Ödeme
          </p>
          <div className="flex items-center gap-4 px-6 py-3 rounded-xl bg-slate-900/60 border border-slate-700/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/payment/iyzico-logo-band-white.svg"
              alt="iyzico"
              className="h-7 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-xs text-slate-600">
            Ödemeler iyzico sanal POS altyapısı üzerinden güvenle işlenir
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
