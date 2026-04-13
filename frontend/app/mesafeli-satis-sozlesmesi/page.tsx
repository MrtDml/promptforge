import type { Metadata } from "next";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi — PromptForge",
  description:
    "PromptForge abonelik hizmetine ilişkin Mesafeli Satış Sözleşmesi. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında hazırlanmıştır.",
};

export default function MesafeliSatisSozlesmesiPage() {
  const lastUpdated = "13 Nisan 2026";

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-slate-500 text-sm">Son güncelleme: {lastUpdated}</p>
        </header>

        <div className="prose prose-invert prose-slate max-w-none
          prose-h2:text-xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-base prose-h3:font-semibold prose-h3:text-slate-200 prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-3
          prose-ul:text-slate-300 prose-li:my-1
          prose-strong:text-white">

          <p>
            Bu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
            Mesafeli Sözleşmeler Yönetmeliği çerçevesinde, aşağıda bilgileri yer alan SATICI ile mal veya hizmetleri
            satın alan ALICI arasında kurulmuştur.
          </p>

          <h2>1. Taraflar</h2>

          <h3>Satıcı Bilgileri</h3>
          <ul>
            <li><strong>Unvan:</strong> Dumlu Teknoloji, Yazılım ve Danışmanlık</li>
            <li><strong>Ticaret Unvanı:</strong> Dumlu Teknoloji, Yazılım ve Danışmanlık</li>
            <li><strong>Adres:</strong> İstanbul, Türkiye</li>
            <li><strong>E-posta:</strong> hello@promptforgeai.dev</li>
            <li><strong>Web Sitesi:</strong> https://promptforgeai.dev</li>
          </ul>

          <h3>Alıcı Bilgileri</h3>
          <p>
            Alıcı, ödeme işlemi sırasında sisteme kayıtlı ad, soyad ve e-posta adresi bilgileriyle tanımlanır.
          </p>

          <h2>2. Sözleşmenin Konusu</h2>
          <p>
            Bu Sözleşme; ALICI&apos;nın, SATICI&apos;ya ait <strong>promptforgeai.dev</strong> internet sitesi üzerinden
            elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen hizmetin satışı ve
            ifasına ilişkin olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair
            Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerini kapsar.
          </p>

          <h2>3. Hizmet Bilgileri</h2>
          <ul>
            <li><strong>Hizmet adı:</strong> PromptForge — AI destekli SaaS kod üretici</li>
            <li><strong>Hizmet türü:</strong> Dijital abonelik hizmeti (SaaS)</li>
            <li>
              <strong>Planlar ve ücretler:</strong>
              <ul>
                <li>Starter Planı — Aylık ₺950 / Yıllık ₺760/ay (KDV dahil değildir)</li>
                <li>Pro Planı — Aylık ₺3.250 / Yıllık ₺2.600/ay (KDV dahil değildir)</li>
              </ul>
            </li>
            <li><strong>Ödeme yöntemi:</strong> Kredi/banka kartı (iyzico güvenli ödeme altyapısı)</li>
            <li><strong>Fatura kesme şekli:</strong> Abonelik başlangıç tarihinde otomatik olarak işlenir.</li>
          </ul>

          <h2>4. Genel Hükümler</h2>
          <p>
            ALICI, www.promptforgeai.dev internet sitesinde sözleşme konusu hizmetin temel nitelikleri, satış fiyatı
            ve ödeme şekline dair ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi
            verdiğini beyan eder.
          </p>
          <p>
            Hizmet; ALICI&apos;nın ödeme işlemini tamamlamasının ardından, belirtilen e-posta adresine aktivasyon
            bildirimi gönderilmesiyle başlar. Dijital hizmet niteliğinde olduğundan, hizmetin ifasına derhal
            başlanır.
          </p>

          <h2>5. Cayma Hakkı</h2>
          <p>
            ALICI, aboneliğini başlattığı tarihten itibaren <strong>14 (on dört) gün</strong> içinde herhangi bir
            gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
          </p>
          <p>
            Cayma hakkının kullanılabilmesi için bu süre içinde SATICI&apos;ya yazılı bildirimde bulunulması yeterlidir.
            Bildirim için <a href="mailto:hello@promptforgeai.dev" className="text-indigo-400 hover:text-indigo-300">hello@promptforgeai.dev</a> adresine
            e-posta gönderilebilir veya hesap ayarlarından abonelik iptal edilebilir.
          </p>
          <p>
            Cayma bildiriminin ulaşmasından itibaren en geç <strong>14 gün</strong> içinde ödeme iadesi yapılır.
            İade, orijinal ödeme yöntemiyle gerçekleştirilir.
          </p>
          <p>
            <strong>İstisna:</strong> ALICI&apos;nın talebi veya açık onayıyla hizmetin ifasına cayma süresi dolmadan
            başlanmışsa ve hizmet tamamen ifa edilmişse, ALICI cayma hakkını kaybeder. Ancak PromptForge, aboneliğin
            ilk 14 günü içinde yapılan iade taleplerini koşulsuz olarak kabul etmektedir.
          </p>

          <h2>6. Abonelik Yenileme ve İptal</h2>
          <p>
            Abonelikler, seçilen dönem sonunda (aylık veya yıllık) otomatik olarak yenilenir. ALICI; aboneliğini
            hesap ayarları sayfasından veya <a href="mailto:hello@promptforgeai.dev" className="text-indigo-400 hover:text-indigo-300">hello@promptforgeai.dev</a> adresine
            e-posta göndererek her zaman iptal edebilir. İptal, mevcut dönem sonunda yürürlüğe girer; kalan süre
            için ücret iadesi yapılmaz.
          </p>

          <h2>7. Ücret ve Faturalama</h2>
          <p>
            Tüm fiyatlar Türk Lirası (TRY) cinsinden belirtilmiş olup KDV hariçtir. ALICI, ödeme sırasında
            geçerli vergi oranlarını içeren toplam tutarı onaylar. Fatura, kayıtlı e-posta adresine iletilir.
          </p>

          <h2>8. Gizlilik</h2>
          <p>
            ALICI&apos;ya ait kişisel veriler, SATICI&apos;nın <a href="/privacy" className="text-indigo-400 hover:text-indigo-300">Gizlilik Politikası</a> ve
            {" "}<a href="/kvkk" className="text-indigo-400 hover:text-indigo-300">KVKK Aydınlatma Metni</a> kapsamında işlenir.
          </p>

          <h2>9. Uyuşmazlık Çözümü</h2>
          <p>
            Bu Sözleşme&apos;den doğan uyuşmazlıklarda, Türkiye Cumhuriyeti kanunları uygulanır. ALICI,
            Tüketici Mahkemelerine ve/veya Tüketici Hakem Heyetlerine başvurma hakkına sahiptir.
            Tüketici Hakem Heyetleri için uygulanacak parasal sınırlar ilgili mevzuatta belirlenmektedir.
          </p>

          <h2>10. Yürürlük</h2>
          <p>
            ALICI; bu Sözleşme&apos;yi elektronik ortamda teyit etmekle, mesafeli sözleşmeler uygulama esaslarını
            düzenleyen mevzuat hükümlerinde öngörülen tüm ön bilgileri doğru ve eksiksiz olarak aldığını,
            bu ön bilgileri elektronik ortamda teyit ettiğini ve akabinde sipariş verdiğini beyan ve taahhüt eder.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
