"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Zap, RefreshCw } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const loggedIn = isAuthenticated();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    apiClient
      .get(`/api/v1/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data?.message ?? "Email verified successfully!");
        setTimeout(() => router.push("/dashboard"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ?? "Verification link is invalid or has expired."
        );
      });
  }, [token, router]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function handleResend() {
    if (resending || cooldown > 0) return;
    setResending(true);
    try {
      await apiClient.post("/api/v1/auth/resend-verification");
      setResent(true);
      setCooldown(60);
    } catch {
      // ignore
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
      {status === "loading" && (
        <>
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
          <p className="text-slate-300 font-medium">Verifying your email…</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <div>
            <p className="text-white font-semibold text-lg">Email verified!</p>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
            <p className="text-slate-500 text-xs mt-3">Redirecting to dashboard…</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            Go to Dashboard
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <div>
            <p className="text-white font-semibold text-lg">Verification failed</p>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {loggedIn && (
              resent ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">New verification email sent! Check your inbox.</p>
                </div>
              ) : (
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
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Send new verification email"}
                </button>
              )
            )}
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-semibold transition-colors text-center"
            >
              Go to Dashboard
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
