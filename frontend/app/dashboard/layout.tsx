"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getStoredUser } from "@/lib/auth";
import Sidebar from "@components/layout/Sidebar";
import AssistantWidget from "@components/ui/AssistantWidget";
import ErrorBoundary from "@components/ui/ErrorBoundary";
import { Menu, Zap, MailWarning, X, Loader2 } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Auth check — redirect to login immediately if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const user = getStoredUser();
    if (user && user.emailVerified === false && user.role !== "ADMIN") {
      setShowVerifyBanner(true);
    }
    setAuthChecked(true);
  }, [router]);

  // Cooldown countdown for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

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

  // Block render until auth check completes — prevents flash of dashboard for unauthenticated users
  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — off-canvas drawer on mobile, static on md+ */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">PromptForge</span>
          </Link>
        </header>

        {/* Email verification banner */}
        {showVerifyBanner && (
          <div className="bg-amber-950/60 border-b border-amber-800/50 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
            <MailWarning className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-amber-200 text-sm flex-1">
              Tüm özellikleri kullanmak için e-posta adresini doğrula.{" "}
              {resent ? (
                <span className="text-green-400 font-medium">
                  Doğrulama e-postası gönderildi!{cooldown > 0 ? ` ${cooldown} saniye sonra tekrar gönderebilirsin.` : ""}
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="underline text-amber-300 hover:text-amber-100 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {resending && <Loader2 className="w-3 h-3 animate-spin" />}
                  {cooldown > 0 ? `${cooldown}s sonra tekrar gönder` : "Doğrulama e-postası gönder"}
                </button>
              )}
            </p>
            <button
              onClick={() => setShowVerifyBanner(false)}
              className="text-amber-500 hover:text-amber-300 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            <div className="min-h-full">{children}</div>
          </ErrorBoundary>
        </main>
      </div>

      <AssistantWidget />
    </div>
  );
}
