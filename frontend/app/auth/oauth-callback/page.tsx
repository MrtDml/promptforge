"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken, setRefreshToken } from "@/lib/auth";
import { authApi } from "@/lib/api";

function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!token) {
      router.replace("/login?error=OAuth+failed");
      return;
    }

    setToken(token);
    if (refreshToken) setRefreshToken(refreshToken);

    authApi
      .me()
      .then((res) => {
        const user = (res.data as any)?.data ?? res.data;
        if (user) {
          localStorage.setItem("promptforge_user", JSON.stringify(user));
        }
        const isNew = !user?.generationsUsed || user.generationsUsed === 0;
        router.replace(isNew ? "/onboarding" : "/dashboard");
      })
      .catch(() => router.replace("/dashboard"));
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Signing you in…</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
