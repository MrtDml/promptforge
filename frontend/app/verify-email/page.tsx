"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

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
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              Go to Dashboard
            </Link>
            <p className="text-xs text-slate-600">
              Need a new link? Go to dashboard and click{" "}
              <span className="text-slate-400">&quot;Resend verification&quot;</span>.
            </p>
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
