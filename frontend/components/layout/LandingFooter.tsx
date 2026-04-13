import Link from "next/link";
import { Zap } from "lucide-react";

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">PromptForge</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              SaaS fikrinizi yapay zeka ile dakikalar içinde üretime hazır koda dönüştürün.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Ürün</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Özellikler</Link></li>
              <li><Link href="/#how-it-works" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Nasıl çalışır</Link></li>
              <li><Link href="/pricing" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Fiyatlandırma</Link></li>
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kaynaklar</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Dokümantasyon</Link></li>
              <li><Link href="/support" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Destek</Link></li>
              <li><Link href="/contact" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Hukuki</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="/kvkk" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">KVKK</Link></li>
              <li><Link href="/mesafeli-satis-sozlesmesi" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/iade-politikasi" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">İptal ve İade</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-slate-200 text-sm transition-colors">Hakkımızda</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment security badges */}
        <div className="border-t border-slate-800/60 pt-6 mb-6">
          <p className="text-xs text-slate-600 uppercase tracking-wider mb-3 text-center sm:text-left">Güvenli ödeme altyapısı</p>
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            {/* iyzico badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
              <span className="text-[10px] font-black text-white tracking-tight">iyzico</span>
            </div>
            {/* Visa */}
            <div className="flex items-center px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
              <span className="text-[11px] font-black text-blue-400 tracking-widest italic">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
              <span className="w-4 h-4 rounded-full bg-red-500 opacity-90 inline-block -mr-2" />
              <span className="w-4 h-4 rounded-full bg-orange-400 opacity-90 inline-block" />
              <span className="text-[10px] text-slate-400 font-semibold ml-1.5">Mastercard</span>
            </div>
            {/* Troy */}
            <div className="flex items-center px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
              <span className="text-[11px] font-black text-slate-300 tracking-wider">TROY</span>
            </div>
            {/* SSL */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-800/40 bg-green-950/30">
              <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              <span className="text-[10px] text-green-400 font-semibold">SSL Güvenli</span>
            </div>
            {/* 3D Secure */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-semibold">3D Secure</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p className="text-slate-600 text-xs">
              © {year} Prompt Forge. Tüm hakları saklıdır.
            </p>
            <span className="hidden sm:inline text-slate-700 text-xs">·</span>
            <p className="text-slate-700 text-xs">
              <Link href="/about" className="hover:text-slate-500 transition-colors">
                Dumlu Teknoloji, Yazılım ve Danışmanlık
              </Link>{" "}
              ürünüdür
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/register" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Ücretsiz başla →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
