import type { Metadata } from "next";
import Link from "next/link";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — PromptForge",
  description:
    "PromptForge platformuna ait Kullanım Koşulları. Hesap oluşturma, abonelik, fikri mülkiyet ve kabul edilebilir kullanım politikalarına dair bilgiler.",
  alternates: { canonical: "https://promptforgeai.dev/terms" },
  openGraph: {
    title: "Kullanım Koşulları — PromptForge",
    description:
      "PromptForge platformuna ait Kullanım Koşulları. Hesap, abonelik ve fikri mülkiyet politikaları.",
    url: "https://promptforgeai.dev/terms",
    siteName: "PromptForge",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PromptForge Kullanım Koşulları" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kullanım Koşulları — PromptForge",
    description: "PromptForge platformuna ait Kullanım Koşulları.",
    images: ["/twitter-image"],
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100">
      <AnnouncementBanner />
      <LandingNav />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <p className="text-indigo-400 text-sm font-medium mb-3">Hukuki</p>
          <h1 className="text-4xl font-bold text-white mb-4">Kullanım Koşulları</h1>
          <p className="text-slate-400">Son güncelleme: 25 Mart 2026</p>
        </div>

        <div className="space-y-10">
          <section>
            <p className="text-slate-300 leading-relaxed">
              Bu Kullanım Koşulları (&quot;Koşullar&quot;), PromptForge (&quot;Hizmet&quot;) platformuna erişiminizi ve kullanımınızı düzenlemektedir. Hizmet, PromptForge (&quot;biz&quot;, &quot;bize&quot;, &quot;bizim&quot;) tarafından işletilmektedir. Hizmete erişerek veya Hizmeti kullanarak bu Koşullara bağlı kalmayı kabul etmektesiniz.
            </p>
          </section>

          {[
            {
              title: "1. Koşulların Kabulü",
              text: "PromptForge'da hesap oluşturarak veya Hizmeti kullanarak en az 16 yaşında olduğunuzu ve bu Koşulları kabul etme ehliyetine sahip olduğunuzu onaylarsınız. Hizmeti bir kuruluş adına kullanıyorsanız, o kuruluşu bu Koşullarla bağlama yetkisine sahip olduğunuzu beyan edersiniz.",
            },
            {
              title: "2. Hizmetin Tanımı",
              text: "PromptForge, doğal dil açıklamalarından full-stack uygulama kodu üreten yapay zeka destekli bir platformdur. Hizmet; Prisma şemaları, REST API iskelet yapısı, kimlik doğrulama modülleri ve dağıtım yapılandırmaları dahil olmak üzere NestJS backend projeleri üretir. Üretilen kod, kendi projelerinizde kullanmanız için olduğu haliyle sunulmaktadır.",
            },
            {
              title: "3. Hesap Oluşturma",
              items: [
                "Doğru ve eksiksiz kayıt bilgileri sağlamalısınız",
                "Hesap kimlik bilgilerinizin güvenliğini korumaktan sorumlusunuz",
                "Hesabınızın yetkisiz kullanımını derhal bize bildirmelisiniz",
                "Hesabınızı başkalarıyla paylaşamaz veya izinsiz olarak üçüncü taraflar adına hesap oluşturamazsınız",
                "Kayıt taleplerini reddetme veya hesapları askıya alma hakkımızı saklı tutarız",
              ],
            },
            {
              title: "4. Abonelik ve Faturalama",
              items: [
                "Ücretsiz plan: Aylık 3 uygulama üretimi, ücretsiz",
                "Starter planı (₺950/ay): Aylık 50 üretim",
                "Pro planı (₺3.250/ay): Sınırsız üretim",
                "Abonelikler aylık olarak faturalandırılır ve otomatik olarak yenilenir",
                "Aboneliğinizi istediğiniz zaman iptal edebilirsiniz; iptal mevcut fatura döneminin sonunda geçerli olur",
                "Tüm ücretli planlar 14 günlük para iade garantisi içerir",
                "Fiyatlar 30 gün önceden bildirim yapılarak değiştirilebilir",
                "Ödemeler iyzico aracılığıyla güvenli şekilde işlenir",
              ],
            },
            {
              title: "5. Kabul Edilebilir Kullanım",
              text: "PromptForge'u aşağıdaki amaçlarla kullanmamayı kabul edersiniz:",
              items: [
                "Kötü amaçlı yazılım veya siber saldırı amacıyla kod üretmek",
                "Yürürlükteki yasaları veya düzenlemeleri ihlal etmek",
                "Üçüncü tarafların fikri mülkiyet haklarını çiğnemek",
                "Hizmetin altyapısını tersine mühendislik, kazıma veya istismar yoluyla kullanmak",
                "Yazılı izin almaksızın Hizmete erişimi yeniden satmak veya dağıtmak",
                "Saldırgan, zararlı veya topluluk yönergelerimizi ihlal eden içerik göndermek",
              ],
            },
            {
              title: "6. Fikri Mülkiyet",
              content: [
                {
                  subtitle: "Promptlarınız",
                  text: "PromptForge'a gönderdiğiniz promptların mülkiyeti size aittir. Prompt göndererek, yalnızca Hizmeti sağlama amacıyla bu promptları işlememiz için bize sınırlı, münhasır olmayan bir lisans vermiş olursunuz.",
                },
                {
                  subtitle: "Üretilen kod",
                  text: "PromptForge tarafından sizin için üretilen kodun sahibi siz olursunuz; ticari projeler dahil her türlü yasal amaçla kullanabilirsiniz. Üretilen çıktılarınız üzerinde herhangi bir mülkiyet iddiamız yoktur.",
                },
                {
                  subtitle: "PromptForge platformu",
                  text: "PromptForge platformu; tasarım, algoritmalar ve kod tabanı dahil olmak üzere bize aittir ve fikri mülkiyet yasalarıyla korunmaktadır. Platformun kendisini kopyalayamazsınız veya çoğaltamazsınız.",
                },
              ],
            },
            {
              title: "7. Hizmet Kullanılabilirliği ve Düzeyleri",
              text: "Yüksek kullanılabilirlik için çaba gösteririz; ancak kesintisiz erişimi garanti etmeyiz. Hizmet olduğu haliyle sunulmaktadır; bakım yapabilir, değişiklik yapabilir veya Hizmeti geçici olarak askıya alabiliriz. Planlı kesintiler için kullanıcıları makul ölçüde bilgilendirmeye çalışırız.",
            },
            {
              title: "8. Sorumluluğun Sınırlandırılması",
              text: "Yasaların izin verdiği azami ölçüde, PromptForge; Hizmeti kullanmanızdan kaynaklanan dolaylı, arızi, özel, sonuç niteliğindeki veya cezai zararlardan sorumlu tutulamaz. Size karşı toplam sorumluluğumuz, talep tarihinden önceki 12 ay içinde bize ödediğiniz tutarı aşmaz. Üretilen kodun doğruluğu, eksiksizliği veya amaca uygunluğundan sorumlu değiliz.",
            },
            {
              title: "9. Garanti Reddi",
              text: "Hizmet, açık veya zımni hiçbir garanti verilmeksizin olduğu haliyle ve mevcut olduğu şekliyle sunulmaktadır. Üretilen kodun hatasız, üretime hazır veya belirli bir amaca uygun olacağını garanti etmiyoruz. Üretilen tüm kodları kullanmadan önce gözden geçirme ve test etme sorumluluğu size aittir.",
            },
            {
              title: "10. Fesih",
              text: "Her iki taraf da bu Koşulları istediği zaman feshedebilir. Koşulları ihlal etmeniz durumunda hesabınızı derhal askıya alma veya feshetme hakkımızı saklı tutarız. Fesih üzerine Hizmeti kullanma hakkınız sona erer; ancak fesihten sonra da geçerliliğini sürdürmesi gereken hükümler (fikri mülkiyet hakları ve sorumluluk sınırlaması dahil) yürürlükte kalmaya devam eder.",
            },
            {
              title: "11. Koşullarda Değişiklik",
              text: "Bu Koşulları istediğimiz zaman değiştirme hakkımızı saklı tutarız. Önemli değişiklikleri e-posta veya platform üzerindeki bir bildirim aracılığıyla duyururuz. Değişikliklerin ardından Hizmeti kullanmaya devam etmeniz yeni Koşulları kabul ettiğiniz anlamına gelir.",
            },
            {
              title: "12. Geçerli Hukuk",
              text: "Bu Koşullar yürürlükteki yasalara tabidir. Bu Koşullardan doğan anlaşmazlıklar öncelikle iyi niyetli müzakere yoluyla çözülmeye çalışılacaktır. Çözüme kavuşturulamaması halinde anlaşmazlıklar, uluslararası alanda tanınan kurallara göre bağlayıcı tahkime tabi olacaktır.",
            },
            {
              title: "13. İletişim",
              text: "Bu Koşullar hakkındaki sorularınız için hello@promptforgeai.dev adresine veya promptforgeai.dev/contact sayfasındaki iletişim formuna ulaşabilirsiniz.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-800">{section.title}</h2>
              {"text" in section && section.text && !("items" in section) && (
                <p className="text-slate-400 leading-relaxed text-sm">{section.text}</p>
              )}
              {"text" in section && section.text && "items" in section && (
                <p className="text-slate-400 leading-relaxed text-sm mb-3">{section.text}</p>
              )}
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
                      <span className="text-indigo-400 mt-1 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">Sorularınız mı var? <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Bize ulaşın</Link></p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Gizlilik Politikası</Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
