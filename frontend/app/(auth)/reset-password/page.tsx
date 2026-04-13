"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Geçersiz veya eksik sıfırlama bağlantısı. Lütfen yeni bir bağlantı talep et.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (err instanceof Error ? err.message : null) ||
        "Bir şeyler ters gitti. Lütfen tekrar dene.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Şifre güncellendi!</h2>
        <p className="text-slate-400 text-sm">
          Şifren başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsun...
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Yeni şifre
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="En az 8 karakter"
              className="input-base pr-11"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Yeni şifre tekrar
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni şifreni tekrar gir"
            className="input-base"
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="btn-primary w-full py-3 text-base mt-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Güncelleniyor...
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              Şifremi sıfırla
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
        <p className="text-slate-400 text-sm">
          Yeni bağlantı mı gerekiyor?{" "}
          <Link
            href="/forgot-password"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Tekrar iste
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Şifreni sıfırla</h1>
        <p className="text-slate-400">Hesabın için yeni bir şifre belirle.</p>
      </div>
      <Suspense fallback={<div className="glass-card p-8 text-center text-slate-400">Yükleniyor...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
