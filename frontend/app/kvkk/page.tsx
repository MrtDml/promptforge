import type { Metadata } from "next";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — PromptForge",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında PromptForge kullanıcılarının kişisel verilerinin nasıl işlendiğine dair aydınlatma metni.",
};

export default function KvkkPage() {
  const lastUpdated = "13 Nisan 2026";

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-100">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            KVKK Aydınlatma Metni
          </h1>
          <p className="text-slate-400 text-sm mb-1">
            6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında
          </p>
          <p className="text-slate-500 text-sm">Son güncelleme: {lastUpdated}</p>
        </header>

        <div className="prose prose-invert prose-slate max-w-none
          prose-h2:text-xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-base prose-h3:font-semibold prose-h3:text-slate-200 prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-3
          prose-ul:text-slate-300 prose-li:my-1
          prose-strong:text-white">

          <p>
            <strong>Dumlu Teknoloji, Yazılım ve Danışmanlık</strong> (&quot;Şirket&quot; veya &quot;Veri Sorumlusu&quot;) olarak,
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca kişisel verilerinizi aşağıda
            açıklanan amaçlar doğrultusunda, hukuka ve dürüstlük kurallarına uygun şekilde işlemekteyiz.
          </p>

          <h2>1. Veri Sorumlusunun Kimliği</h2>
          <ul>
            <li><strong>Unvan:</strong> Dumlu Teknoloji, Yazılım ve Danışmanlık</li>
            <li><strong>Adres:</strong> İstanbul, Türkiye</li>
            <li><strong>E-posta:</strong> hello@promptforgeai.dev</li>
            <li><strong>Web Sitesi:</strong> https://promptforgeai.dev</li>
          </ul>

          <h2>2. İşlenen Kişisel Veriler</h2>
          <p>Hizmetlerimizi kullanmanız kapsamında aşağıdaki kişisel veriler işlenebilir:</p>
          <ul>
            <li><strong>Kimlik verileri:</strong> Ad, soyad</li>
            <li><strong>İletişim verileri:</strong> E-posta adresi</li>
            <li><strong>Hesap verileri:</strong> Kullanıcı adı, şifreli (hash) parola, hesap oluşturma tarihi</li>
            <li><strong>Ödeme verileri:</strong> Fatura bilgileri (kart numarası tarafımızca saklanmaz; ödeme iyzico altyapısı üzerinden işlenir)</li>
            <li><strong>Kullanım verileri:</strong> Oluşturulan projeler, üretim geçmişi, platform kullanım istatistikleri</li>
            <li><strong>Teknik veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgisi, oturum logları</li>
          </ul>

          <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
          <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul>
            <li>Üyelik hesabınızın oluşturulması ve yönetilmesi</li>
            <li>PromptForge hizmetlerinin sunulması ve iyileştirilmesi</li>
            <li>Abonelik ve ödeme işlemlerinin yürütülmesi</li>
            <li>Fatura ve makbuz düzenlenmesi</li>
            <li>Müşteri destek hizmetlerinin sağlanması</li>
            <li>Hizmet ile ilgili bildirim ve güncellemelerin iletilmesi</li>
            <li>Güvenlik, dolandırıcılık önleme ve yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Kullanım analizleri ve hizmet geliştirme</li>
          </ul>

          <h2>4. Kişisel Verilerin İşlenmesinin Hukuki Dayanakları</h2>
          <p>Verileriniz aşağıdaki hukuki dayanaklar kapsamında işlenmektedir:</p>
          <ul>
            <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (KVKK md. 5/2-c)</li>
            <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi (KVKK md. 5/2-ç)</li>
            <li>İlgili kişinin açık rızası (pazarlama iletişimi için — KVKK md. 5/1)</li>
            <li>Meşru menfaat (güvenlik ve hizmet iyileştirme — KVKK md. 5/2-f)</li>
          </ul>

          <h2>5. Kişisel Verilerin Aktarılması</h2>
          <p>Kişisel verileriniz yalnızca aşağıdaki taraflarla ve belirtilen amaçlarla paylaşılabilir:</p>
          <ul>
            <li>
              <strong>iyzico Ödeme Hizmetleri A.Ş.:</strong> Ödeme işlemlerinin gerçekleştirilmesi amacıyla
              ödemeye ilişkin bilgiler aktarılır.
            </li>
            <li>
              <strong>Altyapı sağlayıcıları (Vercel, Railway):</strong> Hizmetin sunulması için gerekli teknik
              altyapı kapsamında işlenir.
            </li>
            <li>
              <strong>Yasal zorunluluklar:</strong> Yetkili kamu kurumu ve kuruluşlarının talepleri doğrultusunda
              yasal yükümlülükler kapsamında paylaşılabilir.
            </li>
          </ul>
          <p>
            Kişisel verileriniz, açık rızanız olmaksızın üçüncü kişilere, reklam amaçlı olarak veya satılmak suretiyle
            aktarılmaz.
          </p>

          <h2>6. Yurt Dışına Veri Aktarımı</h2>
          <p>
            Hizmet altyapımızın bir kısmı yurt dışında konumlanan sunucularda barındırılmaktadır (Vercel — ABD,
            Railway — ABD/Avrupa). Bu aktarımlar, KVKK&apos;nın 9. maddesi kapsamında gerçekleştirilmektedir.
            Açık rızanız, ilgili formlarda ayrıca alınmaktadır.
          </p>

          <h2>7. Kişisel Verilerin Saklama Süresi</h2>
          <ul>
            <li>Hesap verileri: Hesap silinene kadar</li>
            <li>Ödeme ve fatura kayıtları: Yasal yükümlülük gereği 10 yıl</li>
            <li>Log verileri: 1 yıl</li>
            <li>Pazarlama iletişimi verileri: Onay geri alınana kadar</li>
          </ul>

          <h2>8. Kişisel Veri Sahiplerinin Hakları</h2>
          <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
            <li>Düzeltme ve silme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>

          <h2>9. Haklarınızı Nasıl Kullanabilirsiniz?</h2>
          <p>
            Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki kanalları kullanabilirsiniz:
          </p>
          <ul>
            <li>
              <strong>E-posta:</strong>{" "}
              <a href="mailto:hello@promptforgeai.dev" className="text-indigo-400 hover:text-indigo-300">
                hello@promptforgeai.dev
              </a>{" "}
              (konu: KVKK Başvurusu)
            </li>
          </ul>
          <p>
            Başvurularınız, talebin niteliğine göre en geç <strong>30 gün</strong> içinde sonuçlandırılır.
            Talebin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulunca belirlenen tarifedeki
            ücret alınabilir.
          </p>

          <h2>10. Çerezler (Cookies)</h2>
          <p>
            Web sitemizde oturum yönetimi ve hizmet işlevselliği için zorunlu çerezler kullanılmaktadır.
            Analitik çerez kullanımı varsa, bu kapsamda ayrıca onayınız alınmaktadır. Çerez politikamız
            hakkında ayrıntılı bilgiye{" "}
            <a href="/privacy" className="text-indigo-400 hover:text-indigo-300">Gizlilik Politikamız</a>&apos;dan
            ulaşabilirsiniz.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
