"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  CreditCard,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  Shield,
  Zap,
  ArrowUpRight,
  Gift,
  Copy,
  Check,
} from "lucide-react";
import { getStoredUser, setStoredUser, clearAuthState } from "@/lib/auth";

const PASSWORD_REQUIREMENTS = [
  { label: "En az 8 karakter", test: (p: string) => p.length >= 8 },
  { label: "En az bir büyük harf", test: (p: string) => /[A-Z]/.test(p) },
  { label: "En az bir rakam", test: (p: string) => /[0-9]/.test(p) },
];

function getPasswordScore(p: string): number {
  return PASSWORD_REQUIREMENTS.filter((r) => r.test(p)).length;
}
import { usersApi, stripeApi, referralApi } from "@/lib/api";
import type { User as UserType } from "@/types";

// ─── Plan config ─────────────────────────────────────────────────────────────

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 50,
  pro: Infinity,
  enterprise: Infinity,
};

const PLAN_BADGE: Record<string, { label: string; classes: string }> = {
  free: {
    label: "Free",
    classes: "bg-slate-700/60 border-slate-600/50 text-slate-300",
  },
  starter: {
    label: "Starter",
    classes: "bg-blue-600/20 border-blue-500/40 text-blue-300",
  },
  pro: {
    label: "Pro",
    classes: "bg-indigo-600/20 border-indigo-500/40 text-indigo-300",
  },
  enterprise: {
    label: "Enterprise",
    classes: "bg-purple-600/20 border-purple-500/40 text-purple-300",
  },
};

// ─── Reusable section wrapper ────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4.5 h-4.5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description && (
            <p className="text-sm text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Toast helper ────────────────────────────────────────────────────────────

type ToastState = { type: "success" | "error"; message: string } | null;

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  if (!toast) return null;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm mb-4 border ${
        toast.type === "success"
          ? "bg-green-500/10 border-green-500/30 text-green-300"
          : "bg-red-500/10 border-red-500/30 text-red-300"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      )}
      <p className="flex-1">{toast.message}</p>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
  isDeleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const [confirmText, setConfirmText] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-card p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Hesabı sil</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Bu işlem <span className="text-white font-medium">kalıcı ve geri alınamaz</span>.
          Tüm projeleriniz, üretilen kodlarınız ve verileriniz hemen silinecektir.
        </p>
        <p className="text-slate-400 text-sm mb-3">
          Onaylamak için <span className="text-red-400 font-mono font-bold">DELETE</span> yazın:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-red-500/60 mb-5"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 btn-ghost text-sm"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmText !== "DELETE" || isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Hesabımı sil
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [profileToast, setProfileToast] = useState<ToastState>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // ── Password state ──────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordToast, setPasswordToast] = useState<ToastState>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // ── Billing state ────────────────────────────────────────────────────────────
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [billingToast, setBillingToast] = useState<ToastState>(null);

  // ── Delete state ─────────────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Referral state ────────────────────────────────────────────────────────────
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralBonus, setReferralBonus] = useState(0);
  const [applyCode, setApplyCode] = useState("");
  const [referralToast, setReferralToast] = useState<ToastState>(null);
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── User data ─────────────────────────────────────────────────────────────────
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setName(stored.name ?? "");
    }
    usersApi
      .getMe()
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setStoredUser(res.data);
      })
      .catch(() => {});

    referralApi
      .getMyReferral()
      .then((res) => {
        const d = (res.data as any)?.data ?? res.data;
        setReferralCode(d.referralCode);
        setReferralCount(d.referralCount ?? 0);
        setReferralBonus(d.bonusEarned ?? 0);
      })
      .catch(() => {});
  }, []);

  const plan = user?.plan ?? "free";
  const generationsUsed = user?.generationsUsed ?? 0;
  const generationsLimit = user?.generationsLimit ?? PLAN_LIMITS[plan] ?? 3;
  const usagePct =
    generationsLimit === Infinity
      ? 0
      : Math.min(100, Math.round((generationsUsed / generationsLimit) * 100));

  const referralLink = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : "https://promptforgeai.dev"}/register?ref=${referralCode}`
    : null;

  function handleCopyReferral() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleApplyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!applyCode.trim()) return;
    setIsApplyingCode(true);
    setReferralToast(null);
    try {
      await referralApi.applyCode(applyCode.trim());
      setReferralToast({ type: "success", message: "Referans kodu uygulandı! Arkadaşınız bonus üretim hakkı kazandı." });
      setApplyCode("");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? "Geçersiz referans kodu.";
      setReferralToast({ type: "error", message: msg });
    } finally {
      setIsApplyingCode(false);
    }
  }

  // ── Handlers ──────────────────────────────────────────────────────────────────

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setIsSavingProfile(true);
      setProfileToast(null);
      const res = await usersApi.updateProfile({ name: name.trim() });
      setUser(res.data);
      setStoredUser(res.data);
      setProfileToast({ type: "success", message: "Profil başarıyla güncellendi." });
    } catch {
      setProfileToast({ type: "error", message: "Profil güncellenemedi. Lütfen tekrar deneyin." });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordToast({ type: "error", message: "Yeni şifreler eşleşmiyor." });
      return;
    }
    if (getPasswordScore(newPassword) < 3) {
      setPasswordToast({
        type: "error",
        message: "Şifre en az 8 karakter, bir büyük harf ve bir rakam içermelidir.",
      });
      return;
    }
    try {
      setIsSavingPassword(true);
      setPasswordToast(null);
      await usersApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordToast({ type: "success", message: "Şifre başarıyla değiştirildi." });
    } catch {
      setPasswordToast({
        type: "error",
        message: "Şifre değiştirilemedi. Mevcut şifrenizin doğru olduğundan emin olun.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleManageBilling() {
    try {
      setIsPortalLoading(true);
      setBillingToast(null);
      await stripeApi.createPortalSession();
    } catch {
      setBillingToast({
        type: "error",
        message: "Faturalama portalı açılamadı. Lütfen tekrar deneyin.",
      });
      setIsPortalLoading(false);
    }
  }

  async function handleCancelSubscription() {
    try {
      setIsCancelling(true);
      setBillingToast(null);
      await stripeApi.cancelSubscription();
      // Refresh user data
      const res = await usersApi.getMe();
      setUser(res.data);
      setStoredUser(res.data);
      setShowCancelConfirm(false);
      setBillingToast({
        type: "success",
        message: "Aboneliğiniz iptal edildi. Ücretsiz plana geçtiniz.",
      });
    } catch {
      setBillingToast({
        type: "error",
        message: "Abonelik iptal edilemedi. Lütfen tekrar deneyin.",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      setIsDeleting(true);
      await usersApi.deleteAccount();
      clearAuthState();
      router.replace("/");
    } catch {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
        <p className="text-slate-400 mt-1">Hesabınızı, güvenliğinizi ve aboneliğinizi yönetin.</p>
      </div>

      <div className="space-y-6">
        {/* ── Profile ─────────────────────────────────────────────────────── */}
        <Section
          icon={User}
          title="Profil"
          description="Görünen adınızı güncelleyin ve hesap bilgilerinizi görüntüleyin."
        >
          <Toast toast={profileToast} onDismiss={() => setProfileToast(null)} />
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Ad Soyad
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                E-posta adresi
              </label>
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2.5 text-slate-400 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-slate-600 mt-1.5">
                E-posta adresi değiştirilemez. Gerekirse destek ile iletişime geçin.
              </p>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="btn-primary text-sm px-5"
              >
                {isSavingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Değişiklikleri kaydet
              </button>
            </div>
          </form>
        </Section>

        {/* ── Password ─────────────────────────────────────────────────────── */}
        <Section
          icon={Lock}
          title="Şifre Değiştir"
          description="Hesabınızı güvende tutmak için güçlü ve benzersiz bir şifre kullanın."
        >
          <Toast toast={passwordToast} onDismiss={() => setPasswordToast(null)} />
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Mevcut şifre
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Yeni şifre
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
                placeholder="En az 8 karakter"
              />
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => {
                      const score = getPasswordScore(newPassword);
                      return (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            i <= score
                              ? score === 1 ? "bg-red-500" : score === 2 ? "bg-yellow-500" : "bg-green-500"
                              : "bg-slate-700"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="space-y-0.5">
                    {PASSWORD_REQUIREMENTS.map((req) => (
                      <div key={req.label} className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3 h-3 transition-colors ${req.test(newPassword) ? "text-green-400" : "text-slate-600"}`} />
                        <span className={`text-xs transition-colors ${req.test(newPassword) ? "text-slate-300" : "text-slate-500"}`}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Yeni şifreyi onayla
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
                placeholder="Yeni şifreyi tekrar girin"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="btn-primary text-sm px-5"
              >
                {isSavingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Şifreyi güncelle
              </button>
            </div>
          </form>
        </Section>

        {/* ── Subscription ─────────────────────────────────────────────────── */}
        <Section
          icon={CreditCard}
          title="Abonelik"
          description="Planınızı ve faturalama bilgilerinizi yönetin."
        >
          <Toast toast={billingToast} onDismiss={() => setBillingToast(null)} />
          <div className="space-y-5">
            {/* Plan badge + info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white capitalize">
                    {plan} Plan
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PLAN_BADGE[plan]?.classes}`}
                  >
                    {PLAN_BADGE[plan]?.label ?? plan}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {plan === "enterprise"
                    ? "Sınırsız üretim hakkı"
                    : `Aylık ${generationsLimit} proje üretim hakkı`}
                </p>
              </div>
            </div>

            {/* Usage bar */}
            {plan !== "enterprise" && (
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-slate-400 font-medium">Kullanılan üretim</span>
                  <span className="text-slate-500">
                    {generationsUsed} / {generationsLimit}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      usagePct >= 90
                        ? "bg-red-500"
                        : usagePct >= 70
                        ? "bg-yellow-500"
                        : "bg-indigo-500"
                    }`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {plan === "free" && (
                <Link
                  href="/pricing"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Planı Yükselt
                </Link>
              )}
              {plan !== "free" && !showCancelConfirm && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Aboneliği İptal Et
                </button>
              )}
              {plan !== "free" && showCancelConfirm && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-300 flex-1">
                    Aboneliğinizi iptal etmek istediğinizden emin misiniz?
                  </p>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Evet, İptal Et
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-400 text-xs font-medium hover:text-white transition-colors"
                  >
                    Vazgeç
                  </button>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* ── Referral ──────────────────────────────────────────────────────── */}
        <Section
          icon={Gift}
          title="Davet Et & Kazan"
          description="Arkadaşlarınızı davet edin, her başarılı kayıt için 3 ekstra üretim hakkı kazanın."
        >
          <Toast toast={referralToast} onDismiss={() => setReferralToast(null)} />

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{referralCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">Davet edilen arkadaş</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">+{referralBonus}</p>
              <p className="text-xs text-slate-400 mt-0.5">Kazanılan bonus üretim</p>
            </div>
          </div>

          {/* Referral link */}
          {referralLink && (
            <div className="mb-5">
              <p className="text-sm text-slate-300 font-medium mb-2">Davet bağlantınız</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 font-mono focus:outline-none truncate"
                />
                <button
                  onClick={handleCopyReferral}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-sm font-medium transition-colors flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Kopyalandı!" : "Kopyala"}
                </button>
              </div>
            </div>
          )}

          {/* Apply someone else's code */}
          <form onSubmit={handleApplyCode}>
            <p className="text-sm text-slate-300 font-medium mb-2">Referans kodunuz var mı?</p>
            <div className="flex gap-2">
              <input
                value={applyCode}
                onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
                placeholder="Kodu girin (ör. A1B2C3D4)"
                maxLength={12}
                className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 font-mono"
              />
              <button
                type="submit"
                disabled={isApplyingCode || !applyCode.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex-shrink-0"
              >
                {isApplyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : "Uygula"}
              </button>
            </div>
          </form>
        </Section>

        {/* ── Danger zone ──────────────────────────────────────────────────── */}
        <div className="glass-card p-6 border border-red-500/20">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Tehlikeli Bölge</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Geri alınamaz işlemler — dikkatli ilerleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-white">Hesabı sil</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Hesabınızı ve tüm ilişkili verileri kalıcı olarak siler.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-sm font-medium transition-colors ml-4 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Sil
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete modal ──────────────────────────────────────────────────── */}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
