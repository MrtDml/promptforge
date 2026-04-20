"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricingTier {
  id: "free" | "starter" | "pro";
  name: string;
  description: string;
  monthlyPriceTRY: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  badge?: string;
  badgeColor?: string;
  cta: string;
  ctaVariant: "ghost" | "primary" | "secondary";
  highlight: boolean;
  features: string[];
  limits: string[];
}

// ─── Pricing data ─────────────────────────────────────────────────────────────

const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    description: "PromptForge'u keşfetmek ve yan projeler için mükemmel.",
    monthlyPriceTRY: 0,
    icon: Zap,
    iconColor: "text-slate-400",
    iconBg: "bg-slate-400/10",
    cta: "Ücretsiz Başla",
    ctaVariant: "ghost",
    highlight: false,
    features: [
      "Ayda 3 uygulama üretimi",
      "Temel entity desteği (en fazla 5)",
      "Prisma şema üretimi",
      "REST API iskelet oluşturma",
      "Topluluk desteği",
    ],
    limits: [
      "İlişki algılama yok",
      "M:N ilişki desteği yok",
      "Öncelikli kuyruk yok",
      "Takım işbirliği yok",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "Gerçek ürünleri hızla çıkaran bağımsız geliştiriciler için.",
    monthlyPriceTRY: 950,
    icon: Sparkles,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-400/10",
    badge: "En Popüler",
    badgeColor: "bg-indigo-600 text-white",
    cta: "Starter'a Geç",
    ctaVariant: "primary",
    highlight: true,
    features: [
      "Ayda 50 uygulama üretimi",
      "Sınırsız entity",
      "1:N ve M:N ilişki desteği",
      "Otomatik ilişki algılama (AI)",
      "Prisma şema + migration",
      "Full-stack kod üretimi",
      "Docker ve CI/CD konfigürasyonu",
      "E-posta desteği (48 saat yanıt)",
    ],
    limits: [
      "Tek kullanıcı workspace",
      "Özel AI model fine-tuning yok",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ölçekte üretim yapan takımlar ve ajanslar için.",
    monthlyPriceTRY: 3250,
    icon: Building2,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/10",
    cta: "Satışa Bağlan",
    ctaVariant: "secondary",
    highlight: false,
    features: [
      "Sınırsız uygulama üretimi",
      "Sınırsız entity ve ilişki",
      "1:N, N:1, M:N tam destek",
      "Çok adımlı AI ilişki çıkarımı",
      "Takım workspace (10 kullanıcıya kadar)",
      "Özel kod depoları",
      "Özel dağıtım hedefleri",
      "Öncelikli kuyruk (< 5s üretim)",
      "Özel Slack kanalı",
      "SLA — %99.9 uptime garantisi",
    ],
    limits: [],
  },
];

// ─── Feature comparison table data ───────────────────────────────────────────

interface ComparisonRow {
  feature: string;
  free: string | boolean;
  starter: string | boolean;
  pro: string | boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Aylık üretim hakkı", free: "3", starter: "50", pro: "Sınırsız" },
  { feature: "Uygulama başına entity", free: "En fazla 5", starter: "Sınırsız", pro: "Sınırsız" },
  { feature: "Üretim hızı", free: "Standart", starter: "Öncelikli", pro: "< 5s garantili" },
  { feature: "1:N ilişki desteği", free: false, starter: true, pro: true },
  { feature: "M:N ilişki desteği", free: false, starter: true, pro: true },
  { feature: "Otomatik ilişki algılama", free: false, starter: true, pro: true },
  { feature: "Çok geçişli AI ilişki çıkarımı", free: false, starter: false, pro: true },
  { feature: "Prisma şema üretimi", free: true, starter: true, pro: true },
  { feature: "Veritabanı migration", free: false, starter: true, pro: true },
  { feature: "Full-stack kod (frontend + backend)", free: false, starter: true, pro: true },
  { feature: "Docker ve CI/CD konfigürasyonu", free: false, starter: true, pro: true },
  { feature: "Özel dağıtım hedefleri", free: false, starter: false, pro: true },
  { feature: "Takım workspace kullanıcısı", free: "1", starter: "1", pro: "10'a kadar" },
  { feature: "Özel depolar", free: false, starter: false, pro: true },
  { feature: "Topluluk desteği", free: true, starter: true, pro: true },
  { feature: "E-posta desteği", free: false, starter: true, pro: true },
  { feature: "Öncelikli Slack kanalı", free: false, starter: false, pro: true },
  { feature: "SLA (%99.9 uptime)", free: false, starter: false, pro: true },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(monthlyPriceTRY: number): string {
  if (monthlyPriceTRY === 0) return "Ücretsiz";
  return `₺${monthlyPriceTRY.toLocaleString("tr-TR")}`;
}

function annualPrice(monthlyPriceTRY: number): number {
  return Math.round(monthlyPriceTRY * 0.8);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-green-400 mx-auto" aria-label="Dahil" />;
  }
  if (value === false) {
    return <X className="w-4 h-4 text-slate-600 mx-auto" aria-label="Dahil değil" />;
  }
  return <span className="text-slate-300 text-sm">{value}</span>;
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function PricingClient() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.ttq?.track("ViewContent", { content_name: "Pricing Page" });
  }, []);

  const handlePlanSelect = useCallback(
    (tier: PricingTier) => {
      if (tier.id === "free") {
        router.push("/register");
        return;
      }

      if (tier.id === "pro") {
        window.location.href = "mailto:hello@promptforgeai.dev?subject=Pro Plan Talebi";
        return;
      }

      // Starter — önce checkout sayfasına yönlendir
      if (!isAuthenticated) {
        router.push(`/register?plan=${tier.id}`);
        return;
      }

      router.push(`/checkout/${tier.id}`);
    },
    [isAuthenticated, router]
  );

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100">
      <AnnouncementBanner />
      <LandingNav />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Şeffaf ve sade fiyatlandırma
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Her{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              geliştirici
            </span>
            {" "}için plan
          </h1>
          <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Ücretsiz başla, büyüdükçe ölçeklen. Gizli ücret yok, başlamak için
            kredi kartı gerekmez.
          </p>

          {/* Currency note */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700/60 text-slate-400 text-sm">
            <span className="text-green-400 font-semibold">₺</span>
            Tüm fiyatlar Türk Lirası (TRY) cinsinden, KDV dahil değildir.
          </div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
              const priceLabel = formatPrice(tier.monthlyPriceTRY);
              const annualMonthly = tier.monthlyPriceTRY > 0 ? annualPrice(tier.monthlyPriceTRY) : 0;
              const annualSaving = tier.monthlyPriceTRY > 0
                ? tier.monthlyPriceTRY * 12 - annualMonthly * 12
                : 0;

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                    tier.highlight
                      ? "border-indigo-500/50 bg-indigo-950/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] scale-[1.02]"
                      : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600/80"
                  }`}
                >
                  {/* Most Popular badge */}
                  {tier.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${tier.badgeColor}`}
                      >
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${tier.iconBg} flex items-center justify-center mb-5`}
                  >
                    <Icon className={`w-6 h-6 ${tier.iconColor}`} />
                  </div>

                  {/* Plan name & description */}
                  <h2 className="text-xl font-bold text-white mb-1">{tier.name}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-2">
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-extrabold text-white">
                        {priceLabel}
                      </span>
                      {tier.monthlyPriceTRY > 0 && (
                        <span className="text-slate-400 text-sm mb-1.5">/ay</span>
                      )}
                    </div>
                    {tier.monthlyPriceTRY > 0 && (
                      <>
                        <p className="text-slate-500 text-xs mt-1">
                          veya yıllık ödemede{" "}
                          <span className="text-green-400 font-semibold">
                            ₺{annualMonthly.toLocaleString("tr-TR")}/ay
                          </span>
                          {" "}— yılda ₺{annualSaving.toLocaleString("tr-TR")} tasarruf
                        </p>
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(tier)}
                    className={`w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-6 mb-8 ${
                      tier.ctaVariant === "primary"
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
                        : tier.ctaVariant === "secondary"
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 hover:border-slate-500/80"
                        : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700/40 hover:border-slate-600/60"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Divider */}
                  <div className="border-t border-slate-700/60 mb-6" />

                  {/* Included features */}
                  <div className="space-y-3 flex-1">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}

                    {/* Excluded features */}
                    {tier.limits.map((limit) => (
                      <div key={limit} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <X className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="text-slate-500 text-sm">{limit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Money-back guarantee note */}
          <p className="text-center text-slate-500 text-sm mt-10">
            Tüm ücretli planlarda{" "}
            <span className="text-slate-400 font-medium">14 gün para iade garantisi</span>{" "}
            bulunmaktadır. Soru sorulmaz.
          </p>

          {/* Secure payment strip */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
              Güvenli Ödeme
            </p>
            <div className="flex items-center gap-4 px-6 py-3 rounded-xl bg-slate-900/60 border border-slate-700/40">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                <span className="text-[11px] font-black text-white tracking-tight">iyzico</span>
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                <span className="text-[11px] font-black text-blue-400 tracking-widest italic">VISA</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                <span className="w-4 h-4 rounded-full bg-red-500 opacity-90 inline-block -mr-2" />
                <span className="w-4 h-4 rounded-full bg-orange-400 opacity-90 inline-block" />
                <span className="text-[10px] text-slate-400 font-semibold ml-1.5">Mastercard</span>
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                <span className="text-[11px] font-black text-slate-300 tracking-wider">TROY</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-800/40 bg-green-950/30">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                <span className="text-[10px] text-green-400 font-semibold">SSL Güvenli</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                <span className="text-[10px] text-slate-400 font-semibold">3D Secure</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Ödemeler iyzico sanal POS altyapısı üzerinden güvenle işlenir
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature comparison table ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">
              Tam özellik karşılaştırması
            </h2>
            <p className="text-slate-400">
              Doğru planı seçmek için ihtiyacınız olan her şey.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/60">
                  <th className="py-5 px-6 text-slate-400 font-medium text-sm w-1/2 bg-slate-900/60">
                    Özellik
                  </th>
                  {TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      className={`py-5 px-4 text-center text-sm font-semibold ${
                        tier.highlight
                          ? "text-indigo-300 bg-indigo-950/40"
                          : "text-slate-300 bg-slate-900/60"
                      }`}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-slate-800/60 last:border-0 ${
                      idx % 2 === 0 ? "bg-slate-900/20" : "bg-transparent"
                    }`}
                  >
                    <td className="py-4 px-6 text-slate-300 text-sm">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CellValue value={row.free} />
                    </td>
                    <td className="py-4 px-4 text-center bg-indigo-950/10">
                      <CellValue value={row.starter} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CellValue value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-12 text-center shadow-[0_0_60px_rgba(99,102,241,0.08)]">
            <h2 className="text-3xl font-bold text-white mb-4">
              Hangi planı seçeceğinizden emin değil misiniz?
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Ücretsiz planla başlayın — kredi kartı gerekmez. Projeniz büyüdükçe
              istediğiniz zaman yükseltin. Ekibimiz doğru planı seçmenizde yardımcı olmaktan mutluluk duyar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
              >
                Ücretsiz başla
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:hello@promptforgeai.dev"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
              >
                Satışla görüş
              </a>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
