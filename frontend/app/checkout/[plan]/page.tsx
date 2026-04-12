"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Loader2,
  Lock,
  ArrowLeft,
  Sparkles,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/api";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

// ─── Plan data ─────────────────────────────────────────────────────────────────

const PLANS = {
  starter: {
    id: "starter" as const,
    name: "Starter",
    icon: Sparkles,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    monthlyPriceTRY: 950,
    annualPriceTRY: 760,
    features: [
      "Ayda 50 uygulama üretimi",
      "Sınırsız entity ve ilişki",
      "1:N ve M:N ilişki desteği",
      "Otomatik ilişki algılama (AI)",
      "Prisma şema + migration",
      "Full-stack kod üretimi",
      "Docker ve CI/CD konfigürasyonu",
      "E-posta desteği (48 saat yanıt)",
    ],
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    icon: Building2,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    monthlyPriceTRY: 3250,
    annualPriceTRY: 2600,
    features: [
      "Sınırsız uygulama üretimi",
      "Takım workspace (10 kullanıcıya kadar)",
      "Özel kod depoları",
      "Öncelikli kuyruk (< 5s üretim)",
      "Özel Slack kanalı",
      "SLA — %99.9 uptime garantisi",
    ],
  },
} as const;

type PlanKey = keyof typeof PLANS;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const planKey = (params?.plan as string)?.toLowerCase() as PlanKey;
  const plan = PLANS[planKey];

  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated (after auth check)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/checkout/${planKey}`);
    }
  }, [authLoading, isAuthenticated, planKey, router]);

  // Redirect if plan is invalid
  useEffect(() => {
    if (!plan) {
      router.push("/pricing");
    }
  }, [plan, router]);

  const handlePay = useCallback(async () => {
    if (!plan) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ url: string }>("/api/v1/stripe/checkout", {
        planType: plan.id,
        billingCycle: billing,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError("Ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [plan, billing]);

  if (authLoading || !plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const Icon = plan.icon;
  const priceTRY = billing === "monthly" ? plan.monthlyPriceTRY : plan.annualPriceTRY;
  const annualSaving = (plan.monthlyPriceTRY - plan.annualPriceTRY) * 12;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <LandingNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back link */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Fiyatlandırmaya dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Order summary (left) ── */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">Siparişinizi tamamlayın</h1>
              <p className="text-slate-400">
                Ödemeniz iyzico güvenli altyapısı üzerinden işlenecektir.
              </p>
            </div>

            {/* Plan card */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-xl ${plan.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">PromptForge {plan.name}</h2>
                  <p className="text-slate-400 text-sm">AI destekli SaaS üretici aboneliği</p>
                </div>
              </div>

              {/* Billing toggle */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    billing === "monthly"
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Aylık
                </button>
                <button
                  onClick={() => setBilling("annual")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border relative ${
                    billing === "annual"
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Yıllık
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    %20
                  </span>
                </button>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 py-4 border-t border-slate-700/60">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">PromptForge {plan.name} ({billing === "monthly" ? "aylık" : "yıllık"})</span>
                  <span className="text-white font-medium">
                    ₺{priceTRY.toLocaleString("tr-TR")}/ay
                  </span>
                </div>
                {billing === "annual" && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">Yıllık indirim (%20)</span>
                    <span className="text-green-400">
                      −₺{annualSaving.toLocaleString("tr-TR")}/yıl
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700/60">
                  <span className="text-white font-semibold">Toplam (aylık)</span>
                  <span className="text-indigo-400 font-bold text-lg">
                    ₺{priceTRY.toLocaleString("tr-TR")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  KDV dahil değildir. Abonelik otomatik yenilenir, istediğiniz zaman iptal edebilirsiniz.
                </p>
              </div>

              {/* Features */}
              <div className="pt-4 space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">Bu planda neler var</p>
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <div className="rounded-xl border border-green-800/40 bg-green-950/20 px-5 py-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 text-sm font-semibold">14 gün para iade garantisi</p>
                <p className="text-green-700 text-xs mt-0.5">
                  Memnun kalmazsanız ilk 14 gün içinde soru sormadan iade ederiz.
                </p>
              </div>
            </div>
          </div>

          {/* ── Payment panel (right) ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 sticky top-24">
              {/* Customer info */}
              <div className="mb-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">Hesap bilgileri</p>
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 px-4 py-3">
                  <p className="text-white text-sm font-medium">{user?.name || "Kullanıcı"}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 rounded-xl border border-red-800/40 bg-red-950/20 px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Yönlendiriliyor...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    iyzico ile Güvenli Öde
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-3">
                Ödeme sayfasına yönlendirileceksiniz
              </p>

              {/* iyzico branding */}
              <div className="mt-5 pt-5 border-t border-slate-700/60">
                <p className="text-xs text-slate-600 text-center mb-3">Güvenli ödeme altyapısı</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                    <span className="text-[10px] font-black text-white tracking-tight">iyzico</span>
                  </div>
                  <div className="flex items-center px-2.5 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                    <span className="text-[10px] font-black text-blue-400 tracking-widest italic">VISA</span>
                  </div>
                  <div className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90 inline-block -mr-1.5" />
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-400 opacity-90 inline-block" />
                    <span className="text-[9px] text-slate-400 font-semibold ml-1">MC</span>
                  </div>
                  <div className="flex items-center px-2.5 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                    <span className="text-[10px] font-black text-slate-300 tracking-wider">TROY</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-green-800/40 bg-green-950/30">
                    <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    <span className="text-[9px] text-green-400 font-semibold">SSL</span>
                  </div>
                  <div className="flex items-center px-2.5 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
                    <span className="text-[9px] text-slate-400 font-semibold">3D Secure</span>
                  </div>
                </div>
              </div>

              {/* Legal links */}
              <p className="text-xs text-slate-600 text-center mt-4">
                Ödeme yaparak{" "}
                <Link href="/terms" className="underline hover:text-slate-400 transition-colors">
                  Kullanım Koşulları
                </Link>
                {" "}ve{" "}
                <Link href="/privacy" className="underline hover:text-slate-400 transition-colors">
                  Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
