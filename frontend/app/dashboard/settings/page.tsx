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
} from "lucide-react";
import { getStoredUser, setStoredUser, clearAuthState } from "@/lib/auth";
import { usersApi, stripeApi } from "@/lib/api";
import type { User as UserType } from "@/types";

// ─── Plan config ─────────────────────────────────────────────────────────────

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 25,
  pro: 100,
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
          <h3 className="text-lg font-semibold text-white">Delete account</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          This action is <span className="text-white font-medium">permanent and irreversible</span>.
          All your projects, generated code, and data will be deleted immediately.
        </p>
        <p className="text-slate-400 text-sm mb-3">
          Type <span className="text-red-400 font-mono font-bold">DELETE</span> to confirm:
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
            Cancel
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
            Delete my account
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

  // ── User data ─────────────────────────────────────────────────────────────────
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Önce localStorage'dan yükle
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setName(stored.name ?? "");
    }
    // API'den taze veri al
    usersApi
      .getMe()
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setStoredUser(res.data);
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
      setProfileToast({ type: "success", message: "Profile updated successfully." });
    } catch {
      setProfileToast({ type: "error", message: "Failed to update profile. Please try again." });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordToast({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordToast({
        type: "error",
        message: "New password must be at least 8 characters.",
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
      setPasswordToast({ type: "success", message: "Password changed successfully." });
    } catch {
      setPasswordToast({
        type: "error",
        message: "Failed to change password. Check that your current password is correct.",
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
        message: "Fatura portalı açılamadı. Lütfen tekrar deneyin.",
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
        message: "Aboneliğiniz iptal edildi. Free plana geçtiniz.",
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
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account, security, and subscription.</p>
      </div>

      <div className="space-y-6">
        {/* ── Profile ─────────────────────────────────────────────────────── */}
        <Section
          icon={User}
          title="Profile"
          description="Update your display name and view account information."
        >
          <Toast toast={profileToast} onDismiss={() => setProfileToast(null)} />
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Email address
              </label>
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2.5 text-slate-400 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-slate-600 mt-1.5">
                Email cannot be changed. Contact support if needed.
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
                Save changes
              </button>
            </div>
          </form>
        </Section>

        {/* ── Password ─────────────────────────────────────────────────────── */}
        <Section
          icon={Lock}
          title="Change Password"
          description="Use a strong, unique password to keep your account secure."
        >
          <Toast toast={passwordToast} onDismiss={() => setPasswordToast(null)} />
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Current password
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
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5 font-medium">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
                placeholder="Repeat new password"
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
                Update password
              </button>
            </div>
          </form>
        </Section>

        {/* ── Subscription ─────────────────────────────────────────────────── */}
        <Section
          icon={CreditCard}
          title="Subscription"
          description="Manage your plan and billing details."
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
                    ? "Unlimited generations included"
                    : `${generationsLimit} project generations per month`}
                </p>
              </div>
            </div>

            {/* Usage bar */}
            {plan !== "enterprise" && (
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-slate-400 font-medium">Generations used</span>
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
                    Aboneliği iptal etmek istediğinizden emin misiniz?
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

        {/* ── Danger zone ──────────────────────────────────────────────────── */}
        <div className="glass-card p-6 border border-red-500/20">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Danger Zone</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Irreversible actions — proceed with caution.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-white">Delete account</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-sm font-medium transition-colors ml-4 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Delete
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
