"use client";

import { useState, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/auth";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "annual";

interface PricingTier {
  id: "free" | "starter" | "pro";
  name: string;
  description: string;
  monthlyPrice: number;
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
    description: "Perfect for exploring PromptForge and side projects.",
    monthlyPrice: 0,
    icon: Zap,
    iconColor: "text-slate-400",
    iconBg: "bg-slate-400/10",
    cta: "Get Started",
    ctaVariant: "ghost",
    highlight: false,
    features: [
      "3 app generations per month",
      "Basic entity support (up to 5 entities)",
      "Prisma schema generation",
      "REST API scaffolding",
      "Community support",
    ],
    limits: [
      "No relation detection",
      "No M:N relationship support",
      "No priority queue",
      "No team collaboration",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "For indie developers shipping real products fast.",
    monthlyPrice: 29,
    icon: Sparkles,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-400/10",
    badge: "Most Popular",
    badgeColor: "bg-indigo-600 text-white",
    cta: "Upgrade to Starter",
    ctaVariant: "primary",
    highlight: true,
    features: [
      "50 app generations per month",
      "Unlimited entities per app",
      "Full 1:N & M:N relation support",
      "Auto relation detection (AI)",
      "Prisma schema + migrations",
      "Full-stack code generation",
      "Docker & CI/CD configs",
      "Email support (48h response)",
    ],
    limits: [
      "Single user workspace",
      "No custom AI model fine-tuning",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For teams and agencies building at scale.",
    monthlyPrice: 99,
    icon: Building2,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/10",
    cta: "Contact Sales",
    ctaVariant: "secondary",
    highlight: false,
    features: [
      "Unlimited app generations",
      "Unlimited entities & relations",
      "Full 1:N, N:1, M:N support",
      "Multi-step AI relation extraction",
      "Team workspace (up to 10 seats)",
      "Private code repositories",
      "Custom deployment targets",
      "Priority queue (< 5s generation)",
      "Dedicated Slack channel",
      "SLA — 99.9% uptime guarantee",
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
  category?: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  // Generation
  { feature: "Monthly generations", free: "3", starter: "50", pro: "Unlimited" },
  { feature: "Entities per app", free: "Up to 5", starter: "Unlimited", pro: "Unlimited" },
  { feature: "Generation speed", free: "Standard", starter: "Priority", pro: "< 5s guaranteed" },

  // Relations
  { feature: "1:N relationship support", free: false, starter: true, pro: true },
  { feature: "M:N relationship support", free: false, starter: true, pro: true },
  { feature: "Auto relation detection", free: false, starter: true, pro: true },
  { feature: "Multi-pass AI relation extraction", free: false, starter: false, pro: true },

  // Code output
  { feature: "Prisma schema generation", free: true, starter: true, pro: true },
  { feature: "Database migrations", free: false, starter: true, pro: true },
  { feature: "Full-stack code (frontend + backend)", free: false, starter: true, pro: true },
  { feature: "Docker & CI/CD configs", free: false, starter: true, pro: true },
  { feature: "Custom deployment targets", free: false, starter: false, pro: true },

  // Collaboration
  { feature: "Team workspace seats", free: "1", starter: "1", pro: "Up to 10" },
  { feature: "Private repositories", free: false, starter: false, pro: true },

  // Support
  { feature: "Community support", free: true, starter: true, pro: true },
  { feature: "Email support", free: false, starter: true, pro: true },
  { feature: "Priority Slack channel", free: false, starter: false, pro: true },
  { feature: "SLA (99.9% uptime)", free: false, starter: false, pro: true },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(monthlyPrice: number, cycle: BillingCycle): string {
  if (monthlyPrice === 0) return "Free";
  const price = cycle === "annual"
    ? Math.round(monthlyPrice * 0.8)
    : monthlyPrice;
  return `$${price}`;
}

function annualSavings(monthlyPrice: number): number {
  return monthlyPrice * 12 - Math.round(monthlyPrice * 0.8) * 12;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-green-400 mx-auto" aria-label="Included" />;
  }
  if (value === false) {
    return <X className="w-4 h-4 text-slate-600 mx-auto" aria-label="Not included" />;
  }
  return <span className="text-slate-300 text-sm">{value}</span>;
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handlePlanSelect = useCallback(
    async (tier: PricingTier) => {
      // Free plan always goes to register
      if (tier.id === "free") {
        router.push("/register");
        return;
      }

      // Pro plan goes to contact sales
      if (tier.id === "pro") {
        window.location.href = "mailto:sales@promptforge.dev?subject=Pro Plan Inquiry";
        return;
      }

      // Paid plans — redirect to register if not logged in
      if (!isAuthenticated) {
        router.push("/register");
        return;
      }

      // Logged-in user — call Stripe checkout
      setLoadingTier(tier.id);
      try {
        const { default: axios } = await import("axios");
        const token = typeof window !== "undefined" ? getToken() : null;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/stripe/checkout`,
          {
            planType: tier.id,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (response.data?.url) {
          window.location.href = response.data.url;
        }
      } catch (err) {
        console.error("Checkout error:", err);
        // Fallback — redirect to register so the user can try again
        router.push("/register");
      } finally {
        setLoadingTier(null);
      }
    },
    [isAuthenticated, billing, router]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnnouncementBanner />
      <LandingNav />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Simple, transparent pricing
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Plans for every{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              builder
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Start free, scale as you grow. No hidden fees, no credit card
            required to begin.
          </p>

          {/* ── Billing toggle ── */}
          <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-700/60 rounded-xl p-1.5">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                billing === "annual"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Annual
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
              const priceLabel = formatPrice(tier.monthlyPrice, billing);
              const isLoading = loadingTier === tier.id;
              const savings = tier.monthlyPrice > 0 ? annualSavings(tier.monthlyPrice) : 0;

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
                      {tier.monthlyPrice > 0 && (
                        <span className="text-slate-400 text-sm mb-1.5">/mo</span>
                      )}
                    </div>
                    {billing === "annual" && tier.monthlyPrice > 0 && (
                      <p className="text-green-400 text-xs mt-1 font-medium">
                        Save ${savings} per year vs monthly
                      </p>
                    )}
                    {billing === "monthly" && tier.monthlyPrice > 0 && (
                      <p className="text-slate-500 text-xs mt-1">
                        or ${Math.round(tier.monthlyPrice * 0.8)}/mo billed annually
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(tier)}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-6 mb-8 ${
                      tier.ctaVariant === "primary"
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 disabled:opacity-60"
                        : tier.ctaVariant === "secondary"
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 hover:border-slate-500/80 disabled:opacity-60"
                        : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700/40 hover:border-slate-600/60 disabled:opacity-60"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        {tier.cta}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
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
            All paid plans include a{" "}
            <span className="text-slate-400 font-medium">14-day money-back guarantee</span>.
            No questions asked.
          </p>
        </div>
      </section>

      {/* ── Feature comparison table ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">
              Full feature comparison
            </h2>
            <p className="text-slate-400">
              Everything you need to make the right choice.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/60">
                  <th className="py-5 px-6 text-slate-400 font-medium text-sm w-1/2 bg-slate-900/60">
                    Feature
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

      {/* ── FAQ teaser / CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-12 text-center shadow-[0_0_60px_rgba(99,102,241,0.08)]">
            <h2 className="text-3xl font-bold text-white mb-4">
              Not sure which plan to pick?
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Start with the Free plan — no credit card required. Upgrade
              anytime as your project grows. Our team is happy to help you
              choose.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
              >
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:support@promptforge.dev"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
              >
                Talk to sales
              </a>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
