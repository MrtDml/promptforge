import type { Metadata } from "next";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası — PromptForge",
  description:
    "PromptForge aboneliklerine ait iptal ve iade koşulları. 14 günlük koşulsuz iade garantisi hakkında bilgi edinin.",
};

export default function IadePolitikasiPage() {
  const lastUpdated = "13 Nisan 2026";

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">İptal ve İade Politikası</h1>
          <p className="text-slate-500 text-sm">Son güncelleme: {lastUpdated}</p>
        </header>

        <div className="prose prose-invert prose-slate max-w-none
          prose-h2:text-xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-base prose-h3:font-semibold prose-h3:text-slate-200 prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-3
          prose-ul:text-slate-300 prose-li:my-1
          prose-strong:text-white">

          <p>
            PromptForge olarak müşteri memnuniyetini ön planda tutuyoruz. Aboneliğinizden memnun kalmamanız
            durumunda aşağıdaki koşullar geçerlidir.
          </p>

          <h2>1. 14 Günlük Koşulsuz İade Garantisi</h2>
          <p>
            Herhangi bir ücretli plana abone olduğunuz tarihten itibaren <strong>14 (on dört) gün</strong> içinde,
            herhangi bir neden belirtmeksizin iade talebinde bulunabilirsiniz. Bu süre içinde yapılan tüm iade
            talepleri koşulsuz olarak karşılanır.
          </p>
          <p>
            İade talebiniz için <a href="mailto:info@promptforge.dev" className="text-indigo-400 hover:text-indigo-300">info@promptforge.dev</a> adresine
            e-posta gönderin veya hesap ayarlarınızdaki &quot;Aboneliği İptal Et&quot; seçeneğini kullanın.
          </p>

          <h2>2. İptal Etme</h2>
          <p>Aboneliğinizi istediğiniz zaman iptal edebilirsiniz:</p>
          <ul>
            <li>
              <strong>Hesap ayarlarından:</strong> Dashboard → Hesap Ayarları → Faturalama sekmesinden
              aboneliğinizi iptal edebilirsiniz.
            </li>
            <li>
              <strong>E-posta ile:</strong>{" "}
              <a href="mailto:info@promptforge.dev" className="text-indigo-400 hover:text-indigo-300">info@promptforge.dev</a>{" "}
              adresine &quot;Abonelik İptali&quot; konusuyla yazabilirsiniz.
            </li>
          </ul>
          <p>
            İptal işlemi, mevcut ödeme döneminin sonunda geçerli olur. Dönem bitmeden önce iptal etseniz dahi
            dönem sonuna kadar hizmete erişiminiz devam eder. Kalan süre için ücret iadesi yapılmaz; ancak
            ilk 14 gün içindeyseniz tam iade alırsınız.
          </p>

          <h2>3. İade Süreci</h2>
          <p>
            İade talebiniz onaylandıktan sonra ödeme, orijinal ödeme yönteminize (kredi/banka kartı)
            iade edilir. İade tutarının kartınıza yansıması <strong>5–10 iş günü</strong> sürebilir;
            bu süre bankanıza ve kart türüne göre değişebilir.
          </p>

          <h2>4. İade Kapsamı Dışındaki Durumlar</h2>
          <p>Aşağıdaki durumlarda iade yapılmaz:</p>
          <ul>
            <li>14 günlük cayma süresi dolduktan sonra yapılan talepler (ilk 14 gün içinde iade geçerlidir)</li>
            <li>Kötüye kullanım veya hizmet şartlarını ihlal nedeniyle sonlandırılan hesaplar</li>
            <li>Kısmi dönem için yapılan indirim veya promosyon uygulamalarından yararlanan abonelikler (münferiden değerlendirilir)</li>
          </ul>

          <h2>5. Yıllık Abonelik İadesi</h2>
          <p>
            Yıllık abonelik satın aldıysanız ve ilk 14 gün içinde iade talebinde bulunuyorsanız ödediğiniz
            tutarın tamamı iade edilir. 14 günden sonra yıllık abonelik iptali, dönem sonunda geçerli olur;
            kalan aylar için kısmi iade yapılmaz.
          </p>

          <h2>6. Ücretsiz Plan</h2>
          <p>
            Ücretsiz plandan ücret alınmadığı için iade uygulaması söz konusu değildir. Ücretsiz plandan
            ücretli plana yükseltme yapıldığında yukarıdaki koşullar geçerli olur.
          </p>

          <h2>7. İletişim</h2>
          <p>
            İptal ve iade talepleriniz veya sorularınız için:
          </p>
          <ul>
            <li><strong>E-posta:</strong>{" "}
              <a href="mailto:info@promptforge.dev" className="text-indigo-400 hover:text-indigo-300">info@promptforge.dev</a>
            </li>
            <li><strong>Yanıt süresi:</strong> En geç 2 iş günü</li>
          </ul>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
