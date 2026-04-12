import Link from "next/link";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnnouncementBanner />
      <LandingNav />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <p className="text-indigo-400 text-sm font-medium mb-3">Hukuki</p>
          <h1 className="text-4xl font-bold text-white mb-4">Gizlilik Politikası</h1>
          <p className="text-slate-400">Son güncelleme: 25 Mart 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10">

          <section>
            <p className="text-slate-300 leading-relaxed">
              PromptForge (&quot;biz&quot;, &quot;bizim&quot; veya &quot;bize&quot;) gizliliğinizi korumaya kararlıdır. Bu Gizlilik Politikası, <strong>promptforgeai.dev</strong> platformumuzu kullandığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı, ifşa ettiğimizi ve koruduğumuzu açıklamaktadır.
            </p>
          </section>

          {[
            {
              title: "1. Topladığımız Bilgiler",
              content: [
                {
                  subtitle: "Hesap Bilgileri",
                  text: "Kayıt olduğunuzda adınızı, e-posta adresinizi ve şifrenizin karma halini topluyoruz. Düz metin şifrenizi hiçbir zaman saklamıyoruz.",
                },
                {
                  subtitle: "Kullanım Verileri",
                  text: "PromptForge'u nasıl kullandığınıza ilişkin verileri topluyoruz; gönderdiğiniz promptlar, oluşturduğunuz projeler ve özellik etkileşimleri bunlara dahildir. Bu veriler hizmeti iyileştirmemize yardımcı olur.",
                },
                {
                  subtitle: "Ödeme Bilgileri",
                  text: "Ödemeler, PCI-DSS uyumlu bir ödeme altyapısı sağlayıcısı olan iyzico tarafından işlenmektedir. Kredi kartı numaranızı veya hassas ödeme bilgilerinizi sunucularımızda saklamıyoruz. Yalnızca abonelik durumunu ve plan bilgilerini saklıyoruz.",
                },
                {
                  subtitle: "Teknik Veriler",
                  text: "Güvenlik ve performans izleme amacıyla IP adreslerini, tarayıcı türünü, işletim sistemini, yönlendiren URL'leri ve cihaz tanımlayıcılarını otomatik olarak topluyoruz.",
                },
              ],
            },
            {
              title: "2. Bilgilerinizi Nasıl Kullanıyoruz",
              items: [
                "PromptForge platformunu sağlamak ve sürdürmek",
                "İşlemlerinizi gerçekleştirmek ve aboneliğinizi yönetmek",
                "İşlemsel e-postalar göndermek (hesap onayı, şifre sıfırlama)",
                "Yapay zeka modellerimizi ve üretim kalitesini iyileştirmek",
                "Dolandırıcılık veya kötüye kullanımı tespit etmek ve önlemek",
                "Yasal yükümlülüklere uymak",
              ],
            },
            {
              title: "3. Veri Paylaşımı",
              content: [
                {
                  subtitle: "Verilerinizi satmıyoruz.",
                  text: "Bilgilerinizi yalnızca platformumuzu işletmemize yardımcı olan güvenilir üçüncü taraf hizmet sağlayıcılarla, katı gizlilik anlaşmaları çerçevesinde paylaşıyoruz.",
                },
                {
                  subtitle: "Kullandığımız üçüncü taraf hizmetler:",
                  text: "Railway (altyapı barındırma), Vercel (ön yüz barındırma), Anthropic (kod üretimi için yapay zeka işleme), iyzico (ödeme işleme). Her sağlayıcının kendi gizlilik politikası mevcuttur.",
                },
              ],
            },
            {
              title: "4. Veri Saklama",
              text: "Hesabınız aktif olduğu sürece hesap verilerinizi saklarız. Üretilen proje dosyaları kolaylığınız için depolanır ve istediğiniz zaman kontrol panelinden silinebilir. Hesap silme işleminin ardından kişisel verilerinizi 30 gün içinde kaldırırız.",
            },
            {
              title: "5. Güvenlik",
              text: "İletim sırasındaki veriler için TLS şifrelemesi, şifreler için bcrypt karma ve JWT tabanlı kimlik doğrulama dahil olmak üzere endüstri standardı güvenlik önlemleri uyguluyoruz. Ancak İnternet üzerinden hiçbir iletim yöntemi %100 güvenli değildir.",
            },
            {
              title: "6. Haklarınız",
              items: [
                "Erişim: Hakkınızda tuttuğumuz kişisel verilerin bir kopyasını talep edebilirsiniz",
                "Düzeltme: Hatalı verilerin düzeltilmesini talep edebilirsiniz",
                "Silme: Hesabınızın ve ilgili verilerin silinmesini talep edebilirsiniz",
                "Taşınabilirlik: Verilerinizi yapılandırılmış, makine tarafından okunabilir bir formatta talep edebilirsiniz",
                "İtiraz: Belirli amaçlar için verilerinizin işlenmesine itiraz edebilirsiniz",
              ],
            },
            {
              title: "7. Çerezler",
              text: "Kimlik doğrulama (localStorage'da saklanan JWT token'ları) ve oturum yönetimi için temel çerezler kullanıyoruz. İzleme veya reklam çerezi kullanmıyoruz. Çerezleri istediğiniz zaman tarayıcı ayarlarınızdan temizleyebilirsiniz.",
            },
            {
              title: "8. Çocukların Gizliliği",
              text: "PromptForge, 16 yaşın altındaki kullanıcılar için tasarlanmamıştır. Çocuklardan bilerek kişisel veri toplamıyoruz. Bir çocuğun bize kişisel veri sağladığını düşünüyorsanız lütfen bizimle iletişime geçin.",
            },
            {
              title: "9. Bu Politikadaki Değişiklikler",
              text: "Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikleri e-posta veya platform üzerinde yayınlanan bir bildirim aracılığıyla duyururuz. Değişikliklerin ardından PromptForge'u kullanmaya devam etmeniz güncellenmiş politikayı kabul ettiğiniz anlamına gelir.",
            },
            {
              title: "10. Bize Ulaşın",
              text: "Bu Gizlilik Politikası hakkında sorularınız veya endişeleriniz varsa hello@promptforgeai.dev adresine veya iletişim sayfamıza yazabilirsiniz.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-800">{section.title}</h2>
              {"content" in section && section.content && (
                <div className="space-y-4">
                  {section.content.map((c) => (
                    <div key={c.subtitle}>
                      <p className="text-white font-medium text-sm mb-1">{c.subtitle}</p>
                      <p className="text-slate-400 leading-relaxed text-sm">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {"items" in section && section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-400 text-sm">
                      <span className="text-indigo-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {"text" in section && section.text && (
                <p className="text-slate-400 leading-relaxed text-sm">{section.text}</p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">Sorularınız mı var? <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Bize ulaşın</Link></p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
