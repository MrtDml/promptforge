import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "Ödeme Başarılı — PromptForge",
  description: "Aboneliğiniz etkinleştirildi. PromptForge'a hoş geldiniz!",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNav />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-green-400" />
              </div>
              <div className="absolute inset-0 rounded-full bg-green-400/10 animate-ping" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-3">
            Ödemeniz alındı!
          </h1>
          <p className="text-slate-400 text-lg mb-2">
            Aboneliğiniz başarıyla etkinleştirildi.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            Birkaç saniye içinde planınız güncellenir. Herhangi bir sorun
            yaşarsanız{" "}
            <a
              href="mailto:hello@promptforgeai.dev"
              className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
            >
              destek ekibimizle
            </a>{" "}
            iletişime geçin.
          </p>

          {/* Next steps */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 text-left mb-8 space-y-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Sıradaki adımlar</p>
            {[
              "Dashboard'a giderek yeni projenizi oluşturun",
              "AI destekli kod üreticinizi deneyin",
              "Oluşturulan kodu ZIP olarak indirin veya GitHub'a aktarın",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-indigo-400 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-slate-300 text-sm">{step}</p>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 w-full justify-center"
          >
            <Sparkles className="w-5 h-5" />
            Dashboard&apos;a Git
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-slate-600 text-xs mt-6">
            Aboneliğinizi{" "}
            <Link
              href="/dashboard/settings?tab=billing"
              className="underline hover:text-slate-400 transition-colors"
            >
              hesap ayarlarından
            </Link>{" "}
            yönetebilirsiniz.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
