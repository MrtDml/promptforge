import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap, Globe2, Code2, Users, Lightbulb, ArrowRight,
  Target, Rocket, Building2, Cpu, Database, Shield,
  CheckCircle2, Github, Twitter, Linkedin,
} from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "Hakkımızda — PromptForge | Dumlu Teknoloji, Yazılım ve Danışmanlık",
  description:
    "PromptForge, Dumlu Teknoloji, Yazılım ve Danışmanlık'in amiral gemisi ürünüdür. Yapay zeka ile SaaS geliştirmeyi herkes için erişilebilir kılma misyonundayız.",
  keywords: [
    "PromptForge hakkında",
    "Dumlu Teknoloji",
    "yapay zeka SaaS şirketi",
    "AI developer tools",
    "NestJS generator şirketi",
    "Türk yazılım şirketi",
    "AI SaaS builder",
  ],
  alternates: { canonical: "https://promptforgeai.dev/about" },
  openGraph: {
    title: "Hakkımızda — PromptForge",
    description:
      "Dumlu Teknoloji, Yazılım ve Danışmanlık, yapay zeka destekli geliştirici araçları üretir. PromptForge, amiral gemisi ürünümüzdür.",
    url: "https://promptforgeai.dev/about",
    siteName: "PromptForge",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Hakkımızda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda — PromptForge",
    description: "Dumlu Teknoloji, Yazılım ve Danışmanlık. Yapay zeka ile SaaS geliştirmeyi herkes için erişilebilir kılıyoruz.",
    images: ["/twitter-image"],
  },
};

const STATS = [
  { value: "~15 sn", label: "Ortalama üretim süresi" },
  { value: "%100", label: "Sahip olduğunuz kod" },
  { value: "2024", label: "Kuruluş yılı" },
  { value: "7/24", label: "Platform erişimi" },
];

const VALUES = [
  {
    icon: Lightbulb,
    title: "Erişilebilirlik",
    body: "Harika yazılım bir mühendis ekibi gerektirmemelidir. Girişimci, ürün müdürü veya solo geliştirici olan herkesin üretime hazır kod çıkarabilmesini sağlayan araçlar üretiyoruz.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    icon: Globe2,
    title: "Küresel erişim",
    body: "Türkiye'den dünyaya üretiyoruz. PromptForge; solo kuruculardan mühendislik ekiplerine kadar geniş bir kitle için tasarlandı ve her özellik bu kararlılığı yansıtıyor.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Code2,
    title: "Mühendislik kalitesi",
    body: "Ürettiğimiz her kod satırı üretim standartlarını karşılar: test edilmiş, güvenli ve sürdürülebilir. Yapay zekanın kaliteyi artırması gerektiğine inanıyoruz, düşürmemesi.",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  {
    icon: Users,
    title: "Müşteri başarısı",
    body: "Müşterilerimiz başardığında biz başarıyoruz. Ücretsiz plan kullanıcısından kurumsal ekibe kadar her kullanıcıya aynı özen ve hızla yaklaşıyoruz.",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/20",
  },
];

const TECH_STACK = [
  { name: "Anthropic Claude", desc: "AI motor", color: "text-orange-300", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { name: "NestJS", desc: "Backend framework", color: "text-red-300", bg: "bg-red-500/10", border: "border-red-500/20" },
  { name: "Prisma ORM", desc: "Veritabanı katmanı", color: "text-teal-300", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  { name: "Next.js 15", desc: "Dashboard & UI", color: "text-white", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  { name: "PostgreSQL", desc: "Veri tabanı", color: "text-sky-300", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { name: "Docker", desc: "Konteynerleştirme", color: "text-blue-300", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { name: "Railway", desc: "Bulut dağıtım", color: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { name: "TypeScript", desc: "Tip güvenliği", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
];

const WHY_US = [
  "Türkçe açıklamalar için optimize edildi",
  "Vendor lock-in yok — kod tamamen sizin",
  "Üretilen kod gerçekten üretime hazır",
  "Prisma + NestJS en güncel best practice'lerle",
  "Railway entegrasyonuyla tek tıkta canlıya alın",
  "Her değişiklik için AI chat asistanı",
];

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "PromptForge Hakkımızda",
  url: "https://promptforgeai.dev/about",
  description:
    "PromptForge, Dumlu Teknoloji, Yazılım ve Danışmanlık'in amiral gemisi ürünüdür. Yapay zeka ile SaaS geliştirmeyi herkes için erişilebilir kılma misyonundayız.",
  mainEntity: {
    "@type": "Organization",
    name: "Dumlu Teknoloji, Yazılım ve Danışmanlık",
    alternateName: "PromptForge",
    url: "https://promptforgeai.dev",
    logo: "https://promptforgeai.dev/opengraph-image",
    foundingDate: "2024",
    email: "hello@promptforgeai.dev",
    telephone: "+905426674230",
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
    knowsAbout: [
      "Yapay Zeka",
      "SaaS Geliştirme",
      "NestJS",
      "Prisma ORM",
      "Backend Kod Üretimi",
      "TypeScript",
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <LandingNav />

      <main className="bg-[#0a0b14] min-h-screen">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          {/* Soft glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-300 text-xs font-medium tracking-wide">Dumlu Teknoloji, Yazılım ve Danışmanlık</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                PromptForge
              </span>
              &apos;un arkasındaki şirket
            </h1>

            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Dumlu Teknoloji, tek bir misyonla kurulan Ankara merkezli bir yazılım ve yapay zeka danışmanlık şirketidir:
              teknik geçmişten bağımsız olarak herkese yazılım geliştirmeyi erişilebilir kılmak.
            </p>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <section className="border-y border-slate-800/60 bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold text-white mb-1 tracking-tight">{s.value}</p>
                  <p className="text-slate-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission + Story ───────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-indigo-600/10 to-violet-600/5 border border-indigo-500/20 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center mb-5">
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Misyonumuz</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                En iyi fikirlerin çoğunlukla kod yazamayanlardan geldiğine inanıyoruz.
                Dumlu Teknoloji, fikir ile ürün arasındaki engeli ortadan kaldırmak için
                son teknoloji yapay zeka araştırmalarını pratik yazılım mühendisliğiyle birleştirir.
              </p>
              <p className="text-slate-400 leading-relaxed mt-3 text-sm">
                PromptForge, amiral gemisi ürünümüzdür: SaaS fikrinizi Türkçe ile tarif edin,
                saniyeler içinde eksiksiz ve üretime hazır NestJS + Prisma backend edinin.
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-600/10 to-purple-600/5 border border-violet-500/20 rounded-2xl p-8">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center mb-5">
                <Rocket className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Hikâyemiz</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                2024&apos;te kurulan PromptForge, bir geliştirici sorunundan doğdu:
                her yeni SaaS projesinde aynı boilerplate'i tekrar yazmanın ne kadar zaman
                kaybı olduğunu fark ettik.
              </p>
              <p className="text-slate-400 leading-relaxed mt-3 text-sm">
                Bu acıyı çözmek için yapay zekayla entegre, Türk geliştirici ekosistemine
                özel bir platform inşa ettik. Artık binlerce satır şablon kod değil,
                tek bir prompt yeterli.
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────────────────── */}
        <section className="bg-slate-900/30 border-y border-slate-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Değerlerimiz</h2>
              <p className="text-slate-400">Her kararımızın arkasındaki ilkeler.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className={`bg-[#0f1123] border rounded-2xl p-6 hover:border-opacity-60 transition-all duration-300 ${v.border}`}
                  style={{ borderColor: undefined }}
                >
                  <div className={`w-10 h-10 rounded-xl ${v.bg} border ${v.border} flex items-center justify-center mb-4`}>
                    <v.icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Technology Stack ─────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Teknoloji Yığınımız</h2>
            <p className="text-slate-400">Üretilen her projenin arkasındaki teknolojiler.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_STACK.map((t) => (
              <div
                key={t.name}
                className={`${t.bg} border ${t.border} rounded-xl p-4 text-center hover:scale-[1.03] transition-transform duration-200`}
              >
                <p className={`font-bold text-sm mb-1 ${t.color}`}>{t.name}</p>
                <p className="text-slate-500 text-xs">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why PromptForge ──────────────────────────────────────────────── */}
        <section className="bg-slate-900/30 border-y border-slate-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Neden PromptForge?</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Lovable, Bolt.new veya v0 gibi araçlar çoğunlukla İngilizce içerik üretimine ve
                  frontend'e odaklanır. PromptForge, Türk geliştirici ekosistemine özel ve
                  gerçekten üretime hazır backend üretimine odaklanır.
                </p>
                <ul className="space-y-3">
                  {WHY_US.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0f1123] border border-slate-800 rounded-2xl p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Dumlu Teknoloji ürünü</p>
                    <h3 className="text-lg font-bold text-white">PromptForge AI</h3>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Her müşteri projesine getirdiğimiz mühendislik titizliğiyle inşa edildi.
                  Ürettiğimiz kod, kendi üretim projelerimizde kullandığımız standarttadır.
                </p>
                <div className="pt-2 border-t border-slate-700/60">
                  <div className="flex gap-3">
                    <a
                      href="https://github.com/MrtDml/promptforge"
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                    <a
                      href="https://x.com/promptforgeai"
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
                    >
                      <Twitter className="w-3.5 h-3.5" /> Twitter/X
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Investor / Partnership ────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#0f1123] border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-6 transition-colors">
              <Building2 className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Yatırımcılar</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Büyüyen bir geliştirici ekosistemi için ölçeklenebilir platform. Pitch deck ve finansal veriler için iletişime geçin.
              </p>
              <a href="mailto:hello@promptforgeai.dev?subject=Yatırım Görüşmesi" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
                İletişime geç <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-[#0f1123] border border-slate-800 hover:border-violet-500/30 rounded-2xl p-6 transition-colors">
              <Cpu className="w-8 h-8 text-violet-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Teknoloji Ortaklığı</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                API entegrasyonları, beyaz etiket çözümler ve özel kurumsal dağıtım seçenekleri için görüşelim.
              </p>
              <a href="mailto:hello@promptforgeai.dev?subject=Teknoloji Ortaklığı" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
                Teklif al <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-[#0f1123] border border-slate-800 hover:border-emerald-500/30 rounded-2xl p-6 transition-colors">
              <Shield className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Kurumsal Lisans</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                10+ kişilik ekipler için özel SLA, öncelikli destek ve şirket içi dağıtım seçenekleri.
              </p>
              <a href="mailto:hello@promptforgeai.dev?subject=Kurumsal Lisans" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors inline-flex items-center gap-1">
                Fiyat al <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
          <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-violet-950/30 p-12 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Geliştirmeye hazır mısınız?</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                PromptForge&apos;u ücretsiz deneyin — kredi kartı gerekmez. İlk uygulamanızı 5 dakikada oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Ücretsiz başla
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors border border-slate-700"
                >
                  İletişime geç
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
