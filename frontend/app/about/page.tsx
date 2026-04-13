import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Globe2, Code2, Users, Lightbulb, ArrowRight } from "lucide-react";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "Hakkımızda — PromptForge | Dumlu Teknoloji, Yazılım ve Danışmanlık",
  description:
    "PromptForge, Dumlu Teknoloji, Yazılım ve Danışmanlık'in bir ürünüdür. Yapay zeka ile SaaS geliştirmeyi herkes için erişilebilir kılma misyonundayız.",
  keywords: [
    "PromptForge hakkında",
    "Dumlu Teknoloji",
    "yapay zeka SaaS şirketi",
    "AI developer tools şirketi",
    "NestJS generator şirketi",
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

const VALUES = [
  {
    icon: Lightbulb,
    title: "Erişilebilirlik",
    body: "Harika yazılım bir mühendis ekibi gerektirmemelidir. Girişimci, ürün müdürü veya solo geliştirici olan herkesin üretime hazır kod çıkarabilmesini sağlayan araçlar üretiyoruz.",
  },
  {
    icon: Globe2,
    title: "Küresel erişim",
    body: "Dünya için üretiyoruz. PromptForge; solo kuruculardan mühendislik ekiplerine kadar küresel, çeşitli bir kitle için tasarlandı ve her özellik bu kararlılığı yansıtıyor.",
  },
  {
    icon: Code2,
    title: "Mühendislik kalitesi",
    body: "Ürettiğimiz her kod satırı üretim standartlarını karşılar: test edilmiş, güvenli ve sürdürülebilir. Yapay zeka desteğinin kaliteyi artırması gerektiğine inanıyoruz, düşürmemesi.",
  },
  {
    icon: Users,
    title: "Müşteri başarısı",
    body: "Müşterilerimiz başardığında biz başarıyoruz. Ücretsiz plan kullanıcısından kurumsal ekibe kadar her kullanıcıya aynı özen ve hızla yaklaşıyoruz.",
  },
];

export default function AboutPage() {
  return (
    <>
      <LandingNav />

      <main className="bg-[#0a0b14] min-h-screen">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300 text-xs font-medium tracking-wide">Dumlu Teknoloji, Yazılım ve Danışmanlık Hakkında</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Prompt Forge
            </span>
            &apos;un arkasındaki şirket
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Dumlu Teknoloji, Yazılım ve Danışmanlık, tek bir misyonla kurulan küresel bir yazılım ve yapay zeka danışmanlık şirketidir: teknik geçmişten bağımsız olarak dünyadaki herkese yazılım geliştirmeyi erişilebilir kılmak.
          </p>
        </section>

        {/* Mission */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-br from-indigo-600/10 to-violet-600/5 border border-indigo-500/20 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">Misyonumuz</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              En iyi fikirlerin çoğunlukla kod yazamayanlardan geldiğine inanıyoruz — ve tam olarak onlar için üretiyoruz. Dumlu Teknoloji, Yazılım ve Danışmanlık, fikir ile ürün arasındaki engeli ortadan kaldırmak için son teknoloji yapay zeka araştırmalarını pratik yazılım mühendisliğiyle birleştirir.
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              Prompt Forge, amiral gemisi ürünümüzdür: SaaS fikrinizi düz Türkçe ile tarif edin ve saniyeler içinde eksiksiz, üretime hazır bir NestJS + Prisma backend üretelim. Şablon kod yok, kurulum yok — sadece çıkarabileceğiniz çalışan kod.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Değerlerimiz</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-[#0f1123] border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product relationship */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[#0f1123] border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                Dumlu Teknoloji, Yazılım ve Danışmanlık ürünü
              </p>
              <h3 className="text-xl font-bold text-white mb-2">Prompt Forge AI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Claude, Anthropic için ne ise Prompt Forge de Nexlora için odur. Her müşteri projesine getirdiğimiz aynı özen ve mühendislik titizliğiyle inşa edildi.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Geliştirmeye hazır mısınız?</h2>
          <p className="text-slate-400 mb-6">Prompt Forge&apos;u ücretsiz deneyin — kredi kartı gerekmez.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Ücretsiz başla
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl font-semibold text-sm transition-colors border border-slate-700"
            >
              İletişime geç
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
