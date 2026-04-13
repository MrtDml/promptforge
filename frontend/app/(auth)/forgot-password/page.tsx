"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await authApi.forgotPassword(email.trim());
      setSuccess(true);
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
      <div className="animate-fade-in">
        <div className="glass-card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">E-postanı kontrol et</h2>
          <p className="text-slate-400 text-sm mb-6">
            <strong className="text-slate-300">{email}</strong> adresine kayıtlı bir hesap varsa şifre sıfırlama bağlantısı gönderdik. Bağlantı 1 saat geçerlidir.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Şifreni mi unuttun?</h1>
        <p className="text-slate-400">
          E-postanı gir, sıfırlama bağlantısı gönderelim.
        </p>
      </div>

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
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              E-posta adresi
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sen@ornek.com"
              className="input-base"
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="btn-primary w-full py-3 text-base mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Sıfırlama bağlantısı gönder
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
}
