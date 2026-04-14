import Link from "next/link";
import { XCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "Ödeme Başarısız — PromptForge",
  description: "Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.",
};

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100 flex flex-col">
      <LandingNav />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          {/* Error icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-14 h-14 text-red-400" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-3">
            Ödeme tamamlanamadı
          </h1>
          <p className="text-slate-400 text-lg mb-2">
            İşlem sırasında bir sorun oluştu.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            Kartınızdan herhangi bir ücret alınmadı. Farklı bir kart deneyebilir
            veya{" "}
            <a
              href="mailto:hello@promptforgeai.dev"
              className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
            >
              destek ekibimizle
            </a>{" "}
            iletişime geçebilirsiniz.
          </p>

          {/* Common reasons */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 text-left mb-8 space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Olası nedenler</p>
            {[
              "Yetersiz kart bakiyesi",
              "Kart bilgileri hatalı girildi",
              "3D Secure doğrulaması başarısız",
              "Bankanız işlemi reddetti",
            ].map((reason) => (
              <div key={reason} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                <p className="text-slate-400 text-sm">{reason}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/checkout/starter"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Dene
            </Link>
            <Link
              href="/pricing"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 font-semibold px-6 py-3.5 rounded-xl transition-all duration-200"
            >
              Planlara Bak
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-slate-600 text-xs mt-6">
            Sorun devam ederse{" "}
            <a
              href="mailto:hello@promptforgeai.dev"
              className="underline hover:text-slate-400 transition-colors"
            >
              hello@promptforgeai.dev
            </a>{" "}
            adresine yazın.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
