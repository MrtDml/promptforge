"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Zap, RefreshCw } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check login state client-side only to avoid hydration mismatch
    import("@/lib/auth").then(({ isAuthenticated }) => {
      setLoggedIn(isAuthenticated());
    });
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Geçersiz doğrulama bağlantısı.");
      return;
    }

    apiClient
      .get(`/api/v1/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setMessage("E-posta adresin başarıyla doğrulandı!");
        setTimeout(() => router.push("/dashboard"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ?? "Doğrulama bağlantısı geçersiz veya süresi dolmuş."
        );
      });
  }, [token, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function handleResend() {
    if (resending || cooldown > 0) return;
    setResending(true);
    setResendError("");
    try {
      await apiClient.post("/api/v1/auth/resend-verification");
      setResent(true);
      setCooldown(60);
    } catch (err: unknown) {
      setResendError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Yeniden gönderilemedi. Lütfen tekrar deneyin."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
          <p className="text-slate-300 font-medium">E-posta doğrulanıyor…</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <div>
            <p className="text-white font-semibold text-lg">E-posta doğrulandı!</p>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
            <p className="text-slate-500 text-xs mt-3">Dashboard'a yönlendiriliyorsun…</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Dashboard'a Git
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <div>
            <p className="text-white font-semibold text-lg">Doğrulama başarısız</p>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {loggedIn && (
              resent ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">Yeni doğrulama e-postası gönderildi! Gelen kutunu kontrol et.</p>
                </div>
              ) : (
                <>
                  {resendError && (
                    <p className="text-red-400 text-xs">{resendError}</p>
                  )}
                  <button
                    onClick={handleResend}
                    disabled={resending || cooldown > 0}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                  >
                    {resending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {cooldown > 0 ? `${cooldown} saniye bekle` : "Yeni doğrulama e-postası gönder"}
                  </button>
                </>
              )
            )}
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-semibold transition-colors text-center"
            >
              Dashboard'a Git
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">PromptForge</span>
        </Link>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">E-posta Doğrulama</h1>
          <p className="text-slate-400 text-sm">Bağlantı kontrol ediliyor…</p>
        </div>

        <Suspense
          fallback={
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
