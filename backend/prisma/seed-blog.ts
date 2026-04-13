/**
 * Blog yazılarını veritabanına ekleyen seed scripti.
 *
 * Kullanım (Railway DB üzerinde):
 *   cd backend
 *   DATABASE_URL="<railway_postgres_url>" npx ts-node prisma/seed-blog.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  // ─── 1 ────────────────────────────────────────────────────────────────────
  {
    slug: 'saas-nedir-sifirdan-anlatim-gercek-ornekler',
    title: 'SaaS Nedir? Sıfırdan Anlatım ve Gerçek Örnekler',
    description:
      'SaaS nedir, nasıl çalışır ve hangi uygulamalar SaaS modeline girer? Gerçek dünya örnekleriyle sıfırdan kapsamlı bir rehber.',
    category: 'Başlangıç',
    readTime: 8,
    content: `
<h2>SaaS Nedir?</h2>
<p><strong>SaaS (Software as a Service)</strong>, yazılımın internet üzerinden abonelik modeliyle sunulduğu bir dağıtım yöntemidir. Türkçesiyle "Hizmet Olarak Yazılım" anlamına gelir. Kullanıcılar yazılımı bilgisayarlarına kurmaları gerekmez; tarayıcı üzerinden ya da mobil uygulama aracılığıyla erişirler.</p>
<p>Klasik yazılım modelinde bir program satın alır, kurarsınız ve güncellemeleri kendiniz yönetirsiniz. SaaS'ta ise her şey bulutta çalışır: sunucular, güncellemeler, yedeklemeler — bunların tamamı sağlayıcı tarafından karşılanır. Siz sadece aylık ya da yıllık bir ücret ödersiniz.</p>

<h2>SaaS Nasıl Çalışır?</h2>
<p>Teknik açıdan bakıldığında bir SaaS uygulaması şu üç katmandan oluşur:</p>
<ul>
  <li><strong>Frontend:</strong> Kullanıcının gördüğü arayüz. Tarayıcıda ya da mobil uygulamada çalışır.</li>
  <li><strong>Backend / API:</strong> İş mantığının yürütüldüğü sunucu katmanı. Veritabanına erişim, kimlik doğrulama, iş kuralları burada tanımlanır.</li>
  <li><strong>Veritabanı:</strong> Tüm kullanıcı ve uygulama verilerinin depolandığı katman. Bulut üzerinde çalışır, genellikle PostgreSQL veya MySQL tercih edilir.</li>
</ul>
<p>Kullanıcı tarayıcıda bir işlem yaptığında frontend bu isteği backend'e gönderir, backend veritabanını sorgular ve sonucu geri döndürür. Tüm bu süreç milisaniyeler içinde gerçekleşir.</p>

<h2>Gerçek Hayattan SaaS Örnekleri</h2>
<p>Büyük ihtimalle farkında olmadan her gün birçok SaaS uygulaması kullanıyorsunuzdur:</p>
<ul>
  <li><strong>Spotify</strong> — Müzik akış platformu. Şarkıları indirmek yerine aylık ücret ödeyerek her cihazdan dinlersiniz.</li>
  <li><strong>Netflix</strong> — Video içerik platformu. Film ve dizi kütüphanesine internet üzerinden erişirsiniz.</li>
  <li><strong>Notion</strong> — Not alma ve proje yönetim aracı. Belgeleri bulutta depolar, takımınızla gerçek zamanlı çalışırsınız.</li>
  <li><strong>Slack</strong> — İş iletişim platformu. E-posta yerine kanallar ve anlık mesajlaşma üzerinden iş arkadaşlarınızla iletişim kurarsınız.</li>
  <li><strong>Shopify</strong> — E-ticaret platformu. Kendi sunucunuzu kurmadan çevrimiçi mağaza açabilirsiniz.</li>
  <li><strong>Zoom</strong> — Video konferans aracı. Ekip toplantılarını ve webinarları bulut üzerinden yönetirsiniz.</li>
</ul>

<h2>SaaS ile Geleneksel Yazılım Arasındaki Fark</h2>
<table>
  <thead><tr><th>Özellik</th><th>Geleneksel Yazılım</th><th>SaaS</th></tr></thead>
  <tbody>
    <tr><td>Kurulum</td><td>Gerekli</td><td>Gereksiz</td></tr>
    <tr><td>Güncelleme</td><td>Manuel</td><td>Otomatik</td></tr>
    <tr><td>Erişim</td><td>Tek cihaz</td><td>Her cihazdan</td></tr>
    <tr><td>Maliyet</td><td>Tek seferlik lisans</td><td>Aylık / yıllık abonelik</td></tr>
    <tr><td>Ölçekleme</td><td>Zor</td><td>Kolay</td></tr>
  </tbody>
</table>

<h2>SaaS'ın Avantajları</h2>
<p><strong>Kullanıcı açısından:</strong></p>
<ul>
  <li>Düşük başlangıç maliyeti — pahalı lisans ödemesi yok</li>
  <li>Her zaman güncel sürümü kullanırsınız</li>
  <li>Telefon, tablet, bilgisayar — her cihazdan erişim</li>
  <li>Veri kaybı riski düşük, yedekleme otomatik</li>
</ul>
<p><strong>Geliştirici / girişimci açısından:</strong></p>
<ul>
  <li>Tahmin edilebilir gelir (aylık tekrarlayan gelir / MRR)</li>
  <li>Tek kod tabanıyla binlerce müşteriye hizmet verme imkânı</li>
  <li>Kullanıcı davranışlarını analiz edip ürünü hızla geliştirebilme</li>
  <li>Küresel pazara kolayca ulaşma</li>
</ul>

<h2>Türkiye'de SaaS Kullanımı</h2>
<p>Türkiye'de SaaS kullanımı her yıl hızla büyümektedir. Özellikle KOBİ'ler muhasebe, CRM, proje yönetimi ve e-ticaret alanlarında SaaS çözümlere yönelmektedir. Logo, Paraşüt, Sistemtek gibi yerli SaaS şirketleri bu büyümeden payını almaktadır.</p>
<p>Türk girişimciler için SaaS, global rekabete açık kapı niteliğindedir. İngilizce arayüzle sunulan iyi bir SaaS ürünü, dünyanın her yerinden müşteri çekebilir.</p>

<h2>Kendi SaaS Uygulamanı Nasıl Yaparsın?</h2>
<p>Teknik alt yapı en büyük engeldir. Kullanıcı yönetimi, ödeme sistemi, API tasarımı, veritabanı şeması — bunların hepsini sıfırdan yazmak haftalar alabilir.</p>
<p><a href="/dashboard/new">PromptForge</a> tam bu noktada devreye giriyor. Uygulamanı Türkçe olarak açıklıyorsun, yapay zeka üretime hazır NestJS + Prisma backend kodunu dakikalar içinde üretiyor. Böylece teknik altyapıyla değil, ürününle ilgilenebiliyorsun.</p>

<blockquote>
  SaaS kurmak için yazılımcı olmanız şart değil. Doğru araçlarla bir fikri çalışan bir ürüne dönüştürmek artık herkese açık.
</blockquote>
`,
  },

  // ─── 2 ────────────────────────────────────────────────────────────────────
  {
    slug: 'nestjs-nedir-neden-kullanmali',
    title: 'NestJS Nedir, Neden Kullanmalıyım?',
    description:
      'NestJS nedir, Express.js\'den farkı nedir ve neden modern backend geliştirmede tercih edilen framework haline geldi? Kapsamlı başlangıç rehberi.',
    category: 'Başlangıç',
    readTime: 7,
    content: `
<h2>NestJS Nedir?</h2>
<p><strong>NestJS</strong>, Node.js üzerinde çalışan, TypeScript ile yazılmış bir backend uygulama framework'üdür. Angular'ın mimari anlayışından ilham alarak tasarlanmış olup modüler yapısı, bağımlılık enjeksiyonu (dependency injection) ve dekoratör tabanlı sözdizimi ile kurumsal düzeyde uygulamalar geliştirmeyi kolaylaştırır.</p>
<p>2017 yılında Kamil Myśliwiec tarafından geliştirilen NestJS, bugün GitHub'da 60.000'i aşkın yıldıza sahiptir ve dünya genelinde büyük şirketler tarafından kullanılmaktadır.</p>

<h2>NestJS vs Express.js</h2>
<p>Çoğu Node.js geliştiricisi Express.js ile başlar. Express minimal ve esnektir; ancak büyüyen projelerde yapı bozulabilir. NestJS ise katı bir mimari sunar:</p>
<table>
  <thead><tr><th>Özellik</th><th>Express.js</th><th>NestJS</th></tr></thead>
  <tbody>
    <tr><td>Mimari</td><td>Serbest yapı</td><td>Modüler, katmanlı</td></tr>
    <tr><td>TypeScript</td><td>Opsiyonel</td><td>Varsayılan</td></tr>
    <tr><td>Bağımlılık yönetimi</td><td>Manuel</td><td>Dependency Injection</td></tr>
    <tr><td>Test desteği</td><td>Üçüncü parti</td><td>Yerleşik</td></tr>
    <tr><td>Öğrenme eğrisi</td><td>Düşük</td><td>Orta</td></tr>
  </tbody>
</table>

<h2>NestJS'in Temel Kavramları</h2>
<p>NestJS'i anlamak için dört temel kavramı öğrenmek yeterlidir:</p>
<ul>
  <li><strong>Module (Modül):</strong> Uygulamanın işlevsel birimleridir. Örneğin <code>UserModule</code>, <code>AuthModule</code>, <code>ProductModule</code>. Her modül kendi controller ve service'lerini barındırır.</li>
  <li><strong>Controller:</strong> HTTP isteklerini karşılayan katmandır. Hangi endpoint'in ne yapacağını tanımlar. Örneğin <code>GET /users</code> isteğini <code>UserController</code> karşılar.</li>
  <li><strong>Service:</strong> İş mantığının bulunduğu katmandır. Veritabanı sorguları, hesaplamalar, dış API çağrıları burada yapılır.</li>
  <li><strong>Provider:</strong> NestJS'in dependency injection sisteminin temel birimidir. Service'ler birer provider'dır.</li>
</ul>

<h2>Basit Bir Örnek</h2>
<pre><code>// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}</code></pre>
<p>Yukarıdaki kod <code>GET /users</code> ve <code>GET /users/:id</code> endpoint'lerini tanımlar. <code>UsersService</code> dependency injection ile otomatik olarak enjekte edilir.</p>

<h2>NestJS ile Neler Yapabilirsiniz?</h2>
<ul>
  <li>REST API ve GraphQL API geliştirme</li>
  <li>WebSocket ve mikroservis mimarileri</li>
  <li>JWT tabanlı kimlik doğrulama</li>
  <li>Role-based access control (RBAC)</li>
  <li>Prisma, TypeORM veya Mongoose ile veritabanı entegrasyonu</li>
  <li>Bull ile kuyruk (queue) yönetimi</li>
  <li>Swagger ile otomatik API dokümantasyonu</li>
</ul>

<h2>Kimler NestJS Kullanıyor?</h2>
<p>Adidas, Roche, Trilon Group ve dünyanın dört bir yanındaki startup'lar NestJS'i üretim ortamında kullanmaktadır. Özellikle TypeScript ekosistemiyle çalışan ve ölçeklenebilir backend arayan ekipler için birinci tercih haline gelmiştir.</p>

<h2>NestJS'e Hızlı Başlangıç</h2>
<p>Sıfırdan NestJS projesi oluşturmak yerine <a href="/dashboard/new">PromptForge</a>'u kullanarak dakikalar içinde tam yapılandırılmış bir NestJS projesi üretebilirsiniz. Auth modülü, Prisma entegrasyonu, Swagger dokümantasyonu ve Docker konfigürasyonu dahil her şey hazır olarak gelir.</p>
<blockquote>NestJS, küçük bir proje için aşırı mühendislik gibi görünebilir. Ancak proje büyüdüğünde yapısal kararları baştan almış olmanın değeri net şekilde ortaya çıkar.</blockquote>
`,
  },

  // ─── 3 ────────────────────────────────────────────────────────────────────
  {
    slug: 'prisma-ile-veritabani-yonetimi-baslangic-rehberi',
    title: 'Prisma ile Veritabanı Yönetimi: Başlangıç Rehberi',
    description:
      'Prisma ORM nedir, schema nasıl tanımlanır, migration nasıl çalışır? Node.js ve TypeScript projelerinde veritabanı yönetiminin modern yolu.',
    category: 'Başlangıç',
    readTime: 7,
    content: `
<h2>Prisma Nedir?</h2>
<p><strong>Prisma</strong>, Node.js ve TypeScript için geliştirilmiş modern bir ORM (Object-Relational Mapper) aracıdır. Veritabanı tablolarını doğrudan SQL ile yönetmek yerine TypeScript sınıfları ve şemalar aracılığıyla yönetmenizi sağlar. Tam tip güvenliği sunması, güçlü migration sistemi ve sezgisel API'siyle backend geliştiricilerin favorisi haline gelmiştir.</p>
<p>Prisma; PostgreSQL, MySQL, SQLite, MongoDB ve daha birçok veritabanını destekler.</p>

<h2>Prisma'nın Üç Ana Bileşeni</h2>
<ul>
  <li><strong>Prisma Schema:</strong> Veritabanı modellerini tanımladığınız <code>.prisma</code> uzantılı dosya. Tablolar, sütunlar ve ilişkiler burada belirtilir.</li>
  <li><strong>Prisma Client:</strong> Şemadan otomatik olarak üretilen ve tip güvenli veritabanı sorguları yapmanızı sağlayan istemci kütüphanesi.</li>
  <li><strong>Prisma Migrate:</strong> Şema değişikliklerini veritabanına uygulayan migration aracı. Her değişiklik versiyonlanır ve geri alınabilir.</li>
</ul>

<h2>Prisma Şeması Nasıl Tanımlanır?</h2>
<pre><code>// schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}</code></pre>
<p>Bu şema iki tabloyu ve aralarındaki ilişkiyi tanımlar. <code>User</code> birden fazla <code>Post</code> yazabilir (one-to-many ilişki).</p>

<h2>Temel Sorgular</h2>
<pre><code>// Tüm kullanıcıları getir
const users = await prisma.user.findMany();

// E-posta ile tekil kullanıcı bul
const user = await prisma.user.findUnique({
  where: { email: 'ornek@email.com' },
});

// Yeni kullanıcı oluştur
const newUser = await prisma.user.create({
  data: {
    email: 'yeni@email.com',
    name: 'Ahmet Yılmaz',
  },
});

// Kullanıcıyı güncelle
await prisma.user.update({
  where: { id: 'kullanici-id' },
  data: { name: 'Mehmet Yılmaz' },
});

// Kullanıcıyı sil
await prisma.user.delete({
  where: { id: 'kullanici-id' },
});</code></pre>

<h2>Migration Nasıl Çalışır?</h2>
<p>Şemada bir değişiklik yaptığınızda (yeni alan eklemek, tablo değiştirmek vb.) şu komutu çalıştırırsınız:</p>
<pre><code>npx prisma migrate dev --name yeni_alan_eklendi</code></pre>
<p>Bu komut:</p>
<ul>
  <li>Şema değişikliğini analiz eder</li>
  <li>SQL migration dosyası oluşturur</li>
  <li>Değişikliği veritabanına uygular</li>
  <li>Prisma Client'ı yeniden üretir</li>
</ul>

<h2>Prisma'nın Avantajları</h2>
<ul>
  <li><strong>Tam tip güvenliği:</strong> IDE otomatik tamamlama çalışır, yazım hatası olan sorgular derleme zamanında yakalanır.</li>
  <li><strong>Okunabilir sorgular:</strong> Karmaşık SQL yerine anlaşılır TypeScript kodu.</li>
  <li><strong>İlişki yönetimi:</strong> Join sorguları <code>include</code> ile tek satırda yazılır.</li>
  <li><strong>Migrations:</strong> Veritabanı versiyonlaması otomatik ve güvenli.</li>
</ul>

<h2>PromptForge ile Prisma Şeması Oluşturma</h2>
<p>Prisma şeması tasarlamak başlangıç için zor görünebilir. Varlıkları, ilişkileri ve kısıtlamaları doğru tanımlamak deneyim gerektirir. <a href="/dashboard/new">PromptForge</a>'da uygulamanı Türkçe olarak açıkladığında yapay zeka doğru Prisma şemasını sizin için üretir: tablolar, ilişkiler, index'ler ve migration dosyaları dahil.</p>
<blockquote>Prisma, SQL'in gücünü TypeScript'in güvenliğiyle birleştirir. Modern Node.js projelerinde artık ORM seçimi Prisma ile başlayıp Prisma ile bitiyor.</blockquote>
`,
  },

  // ─── 4 ────────────────────────────────────────────────────────────────────
  {
    slug: 'rest-api-nedir-orneklerle-aciklama',
    title: 'REST API Nedir? Örneklerle Açıklama',
    description:
      'REST API nedir, nasıl çalışır, HTTP metodları ne anlama gelir? Frontend ve backend arasındaki iletişimin temelini sıfırdan öğrenin.',
    category: 'Başlangıç',
    readTime: 6,
    content: `
<h2>API Nedir?</h2>
<p><strong>API (Application Programming Interface)</strong>, iki yazılımın birbirleriyle konuşma protokolüdür. Bir restoran benzetmesiyle açıklayalım: siz müşteri, mutfak backend, garson ise API'dir. Siz ne istediğinizi garson'a (API) söylersiniz, garson mutfağa (backend) iletir ve sonucu size geri getirir. Mutfağın nasıl çalıştığını bilmeniz gerekmez.</p>

<h2>REST Nedir?</h2>
<p><strong>REST (Representational State Transfer)</strong>, API tasarımı için bir mimari stildir. REST API'ler HTTP protokolü üzerinden çalışır ve belirli kurallara uyar. Bu kurallara uyan API'lere "RESTful API" denir.</p>
<p>REST'in temel ilkeleri:</p>
<ul>
  <li>Her kaynak benzersiz bir URL'ye sahiptir (ör. <code>/users/42</code>)</li>
  <li>İstemci ve sunucu birbirinden bağımsızdır</li>
  <li>Sunucu istemci durumunu saklamaz (stateless)</li>
  <li>Yanıtlar önbelleğe alınabilir</li>
</ul>

<h2>HTTP Metodları</h2>
<p>REST API'lerde her işlem için uygun HTTP metodu kullanılır:</p>
<table>
  <thead><tr><th>Metod</th><th>Ne Yapar?</th><th>Örnek</th></tr></thead>
  <tbody>
    <tr><td><code>GET</code></td><td>Veri okur</td><td>Tüm kullanıcıları listele</td></tr>
    <tr><td><code>POST</code></td><td>Yeni kayıt oluşturur</td><td>Yeni kullanıcı ekle</td></tr>
    <tr><td><code>PUT</code></td><td>Kaydı tamamen günceller</td><td>Kullanıcı bilgilerini değiştir</td></tr>
    <tr><td><code>PATCH</code></td><td>Kaydı kısmen günceller</td><td>Sadece e-postayı değiştir</td></tr>
    <tr><td><code>DELETE</code></td><td>Kaydı siler</td><td>Kullanıcıyı sil</td></tr>
  </tbody>
</table>

<h2>Gerçek Bir REST API Örneği</h2>
<p>Bir kullanıcı yönetim sistemi için REST API endpoint'leri şöyle tasarlanır:</p>
<pre><code>GET    /users          → Tüm kullanıcıları listele
GET    /users/:id      → ID'ye göre tekil kullanıcı getir
POST   /users          → Yeni kullanıcı oluştur
PATCH  /users/:id      → Kullanıcı bilgilerini güncelle
DELETE /users/:id      → Kullanıcıyı sil

GET    /users/:id/posts   → Kullanıcının yazılarını listele
POST   /users/:id/posts   → Kullanıcıya yeni yazı ekle</code></pre>

<h2>HTTP Durum Kodları</h2>
<p>REST API'ler yanıtlarında durum kodu döndürür. En yaygın olanlar:</p>
<ul>
  <li><code>200 OK</code> — İstek başarılı</li>
  <li><code>201 Created</code> — Kayıt başarıyla oluşturuldu</li>
  <li><code>400 Bad Request</code> — İstek geçersiz (eksik alan vb.)</li>
  <li><code>401 Unauthorized</code> — Kimlik doğrulama gerekli</li>
  <li><code>403 Forbidden</code> — Yetkisiz erişim</li>
  <li><code>404 Not Found</code> — Kayıt bulunamadı</li>
  <li><code>500 Internal Server Error</code> — Sunucu hatası</li>
</ul>

<h2>JSON Formatı</h2>
<p>REST API'ler genellikle JSON formatında veri alışverişi yapar:</p>
<pre><code>// POST /users isteği gövdesi
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@ornek.com",
  "password": "guvenli_sifre"
}

// 201 Created yanıtı
{
  "id": "clt8x2k4p0000qw8h5g3n7b2s",
  "name": "Ahmet Yılmaz",
  "email": "ahmet@ornek.com",
  "createdAt": "2026-04-13T10:30:00Z"
}</code></pre>

<h2>REST API Güvenliği</h2>
<p>Korumalı endpoint'lere erişim için kimlik doğrulama gereklidir. En yaygın yöntem JWT (JSON Web Token) kullanmaktır. Her istekte Authorization başlığına token eklenir:</p>
<pre><code>Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code></pre>

<h2>Kendi REST API'nizi Oluşturun</h2>
<p>REST API tasarımı en temel backend becerisidir. <a href="/dashboard/new">PromptForge</a> ile uygulamanızı tanımladığınızda, tüm CRUD endpoint'leri, DTO validasyonları, guard'lar ve Swagger dokümantasyonu otomatik olarak üretilir.</p>
<blockquote>İyi tasarlanmış bir REST API, uygulamanızın hem mevcut hem de gelecekteki ihtiyaçlarına kolayca cevap verebilir. Doğru isimlendirme ve tutarlı yapı en önemli iki kuraldır.</blockquote>
`,
  },

  // ─── 5 ────────────────────────────────────────────────────────────────────
  {
    slug: 'jwt-kimlik-dogrulama-nasil-calisir',
    title: 'JWT ile Kimlik Doğrulama Nasıl Çalışır?',
    description:
      'JWT nedir, nasıl üretilir ve doğrulanır? Session tabanlı kimlik doğrulamadan farkı nedir? SaaS uygulamalarında güvenli auth sistemi kurmanın temelleri.',
    category: 'Başlangıç',
    readTime: 7,
    content: `
<h2>Kimlik Doğrulama (Authentication) Nedir?</h2>
<p>Bir web uygulamasında kullanıcının kim olduğunu doğrulama işlemine <strong>authentication</strong> (kimlik doğrulama) denir. Kullanıcı adı ve parola ile giriş yapma en basit örneğidir. Ancak bu doğrulama bilgisinin sonraki isteklerde nasıl taşınacağı kritik bir tasarım kararıdır.</p>
<p>İki temel yaklaşım vardır: <strong>Session tabanlı</strong> ve <strong>Token tabanlı (JWT)</strong>.</p>

<h2>JWT Nedir?</h2>
<p><strong>JWT (JSON Web Token)</strong>, taraflar arasında güvenli bilgi aktarımı için kullanılan açık bir standarttır (RFC 7519). Dijital olarak imzalanmış bir token'dır; içeriği şifrelenmiş değildir, ancak değiştirilemez.</p>
<p>JWT üç bölümden oluşur ve nokta (<code>.</code>) ile ayrılır:</p>
<pre><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcxMzAwMDAwMCwiZXhwIjoxNzEzMDg2NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code></pre>
<ul>
  <li><strong>Header:</strong> Token türü ve kullanılan algoritma (ör. HS256)</li>
  <li><strong>Payload:</strong> Taşınan veri — kullanıcı ID'si, rol, geçerlilik süresi</li>
  <li><strong>Signature:</strong> Header ve Payload'ın sunucudaki gizli anahtarla imzalanması</li>
</ul>

<h2>JWT Nasıl Çalışır?</h2>
<p>Adım adım akış:</p>
<ul>
  <li><strong>1. Giriş:</strong> Kullanıcı e-posta ve şifresini gönderir.</li>
  <li><strong>2. Doğrulama:</strong> Sunucu bilgileri kontrol eder, doğruysa JWT üretir.</li>
  <li><strong>3. Token gönderimi:</strong> JWT kullanıcıya döndürülür, tarayıcıda localStorage'a kaydedilir.</li>
  <li><strong>4. Sonraki istekler:</strong> Her API isteğinde token Authorization başlığına eklenir.</li>
  <li><strong>5. Doğrulama:</strong> Sunucu imzayı kontrol eder, geçerliyse isteği işler.</li>
</ul>
<pre><code>// 1. Giriş isteği
POST /auth/login
{ "email": "user@ornek.com", "password": "sifre123" }

// 2. Başarılı yanıt
{ "access_token": "eyJhbGci..." }

// 3. Korumalı endpoint isteği
GET /profile
Authorization: Bearer eyJhbGci...</code></pre>

<h2>Session vs JWT</h2>
<table>
  <thead><tr><th>Özellik</th><th>Session</th><th>JWT</th></tr></thead>
  <tbody>
    <tr><td>Depolama</td><td>Sunucu tarafında</td><td>İstemci tarafında</td></tr>
    <tr><td>Ölçekleme</td><td>Zorlu (paylaşımlı session)</td><td>Kolay (stateless)</td></tr>
    <tr><td>Çoklu cihaz</td><td>Karmaşık</td><td>Sorunsuz</td></tr>
    <tr><td>Token iptali</td><td>Anlık</td><td>Süre dolana kadar geçerli</td></tr>
    <tr><td>Mikroservis</td><td>Zor</td><td>Uygun</td></tr>
  </tbody>
</table>

<h2>JWT Güvenlik İpuçları</h2>
<ul>
  <li><strong>Kısa geçerlilik süresi kullanın:</strong> Access token için 15–60 dakika, refresh token için 7–30 gün idealdir.</li>
  <li><strong>HTTPS zorunlu:</strong> Token'lar şifrelenmemiş kanalda ele geçirilebilir.</li>
  <li><strong>Gizli anahtarı koruyun:</strong> <code>JWT_SECRET</code> ortam değişkeninde saklanmalı, kodda bulunmamalıdır.</li>
  <li><strong>Hassas veri eklemeyin:</strong> JWT payload şifrelenmez, decode edilebilir. Şifre hash'i gibi hassas veriler payload'a yazılmamalıdır.</li>
  <li><strong>Refresh token rotasyonu:</strong> Her refresh işleminde yeni refresh token üretin.</li>
</ul>

<h2>NestJS'te JWT Implementasyonu</h2>
<pre><code>// auth.service.ts
async login(user: User) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  return {
    access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
    refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
  };
}</code></pre>

<h2>Hazır Auth Sistemi</h2>
<p>JWT tabanlı auth sistemi kurmak; refresh token rotasyonu, şifre sıfırlama, e-posta doğrulama ve OAuth entegrasyonu dahil edildiğinde ciddi zaman alır. <a href="/dashboard/new">PromptForge</a> ile üretilen her projede bu sistemin tamamı çalışır halde gelir.</p>
<blockquote>JWT, modern web uygulamalarının bel kemiğidir. Doğru uygulandığında hem güvenli hem de ölçeklenebilir bir auth katmanı sağlar.</blockquote>
`,
  },
];

  // ─── 6 ────────────────────────────────────────────────────────────────────
  {
    slug: 'prompt-yazarak-backend-uygulama-gelistirmek-mumkun-mu',
    title: 'Prompt Yazarak Backend Uygulama Geliştirmek Mümkün mü?',
    description:
      'Yapay zeka destekli kod üretimi gerçekten işe yarıyor mu? Prompt tabanlı backend geliştirmenin sınırlarını ve olanaklarını inceliyoruz.',
    category: 'PromptForge',
    readTime: 7,
    content: `
<h2>Geleneksel Backend Geliştirme Nasıl Çalışır?</h2>
<p>Bir backend uygulaması geliştirmek, geleneksel yöntemle ortalama birkaç günden birkaç haftaya kadar süren bir süreçtir. Geliştiricinin önce proje yapısını kurması, bağımlılıkları yüklemesi, veritabanı şemasını tasarlaması, API rotalarını yazması, kimlik doğrulama sistemini kurması ve ardından tüm bunları test etmesi gerekir.</p>
<p>Bu süreç deneyimli bir geliştirici için bile zaman alıcıdır. Üstelik her proje büyük ölçüde birbirine benzeyen tekrarlayan kodlarla doludur: kullanıcı kaydı, oturum açma, CRUD işlemleri, hata yönetimi...</p>

<h2>Prompt Tabanlı Geliştirme Nedir?</h2>
<p>Prompt tabanlı geliştirme, doğal dilde yazdığınız bir açıklamayı yapay zekanın çalışır koda dönüştürdüğü bir yaklaşımdır. Siz uygulamanızın ne yapması gerektiğini yazarsınız; sistem gerekli kodu, veritabanı şemasını ve yapılandırmayı otomatik olarak üretir.</p>
<p>Bu yaklaşım son iki yılda dramatik biçimde olgunlaştı. İlk jeneratif AI araçları tutarsız, derleme dahi edilemeyen kod üretirken; günümüz sistemleri üretime hazır, test edilebilir ve belgelenmiş kod çıktısı verebilmektedir.</p>

<h2>PromptForge Bu Süreci Nasıl Yönetiyor?</h2>
<p>PromptForge, prompt tabanlı backend geliştirmeyi sistematik bir sürece dönüştürür. Yalnızca "kod yaz" komutu vermez; uygulamanızın tüm mimarisini analiz ederek yapılandırılmış bir çıktı üretir:</p>
<ul>
  <li><strong>Varlık analizi:</strong> Promptunuzdaki nesneleri (kullanıcı, ürün, sipariş vb.) ve aralarındaki ilişkileri çıkarır.</li>
  <li><strong>Prisma şeması:</strong> İlişkisel veritabanı şemasını otomatik oluşturur, indeksler ve kısıtlamalar dahil.</li>
  <li><strong>NestJS modülleri:</strong> Her varlık için servis, denetleyici ve DTO katmanlarını ayrı ayrı üretir.</li>
  <li><strong>Kimlik doğrulama:</strong> JWT tabanlı kayıt/giriş sistemi, yetkilendirme koruması ile birlikte.</li>
  <li><strong>Dokümantasyon:</strong> Swagger/OpenAPI entegrasyonu otomatik olarak eklenir.</li>
</ul>

<h2>Gerçekten Çalışıyor mu? Sınırlar Neler?</h2>
<p>Kısa cevap: evet, çalışıyor — ancak bazı sınırlar var.</p>
<p><strong>Güçlü olduğu alanlar:</strong></p>
<ul>
  <li>Standart CRUD uygulamaları (e-ticaret, proje yönetimi, CRM, rezervasyon sistemleri)</li>
  <li>Tipik kimlik doğrulama ve yetkilendirme akışları</li>
  <li>İlişkisel veri modelleri ve API tasarımı</li>
  <li>Tekrarlayan boilerplate kodunun ortadan kaldırılması</li>
</ul>
<p><strong>Dikkat edilmesi gereken durumlar:</strong></p>
<ul>
  <li>Çok özgün iş mantığı gerektiren algoritmalar (prompt'u daha ayrıntılı yazmanız gerekir)</li>
  <li>Üçüncü taraf entegrasyonlar (ödeme, SMS gibi servisler manuel yapılandırma gerektirebilir)</li>
  <li>Yüksek ölçek gerektiren mimariler (bu durumlarda üretilen kodu başlangıç noktası olarak kullanın)</li>
</ul>

<h2>Kimler İçin Uygun?</h2>
<p>Prompt tabanlı geliştirme şu profillere özellikle değer katmaktadır:</p>
<ul>
  <li><strong>Girişimciler ve ürün sahipleri:</strong> Teknik bilgi gerektirmeden MVP hızla doğrulayabilirler.</li>
  <li><strong>Frontend geliştiriciler:</strong> Backend konusunda tecrübe olmadan tam yığın uygulama geliştirebilirler.</li>
  <li><strong>Deneyimli backend geliştiriciler:</strong> Rutin kurulum kodunu otomatize ederek asıl iş mantığına odaklanabilirler.</li>
  <li><strong>Freelancerlar ve ajanslar:</strong> Proje teslimat hızını önemli ölçüde artırabilirler.</li>
</ul>

<h2>Sonuç</h2>
<p>Prompt yazarak backend geliştirmek yalnızca mümkün değil; doğru araçla kullanıldığında geleneksel yöntemlere kıyasla ciddi avantajlar sunmaktadır. PromptForge ile tipik bir backend kurulumu için harcanan saatleri dakikalara indirebilir, üretilen kodu kendi ihtiyaçlarınıza göre özelleştirebilirsiniz.</p>
<p>Önemli olan, bu aracı bir sihir değil; deneyimli bir geliştirici gibi tekrarlayan işleri sizin yerinize yapan bir yardımcı olarak görmektir.</p>
`,
  },

  // ─── 7 ────────────────────────────────────────────────────────────────────
  {
    slug: 'promptforge-ile-5-dakikada-saas-uygulamasi-nasil-olusturulur',
    title: 'PromptForge ile 5 Dakikada SaaS Uygulaması Nasıl Oluşturulur?',
    description:
      'Adım adım rehber: PromptForge üzerinde hesap açmaktan tam yığın backend projenizi ZIP olarak indirmeye kadar tüm süreç.',
    category: 'PromptForge',
    readTime: 6,
    content: `
<h2>Başlamadan Önce</h2>
<p>PromptForge ile bir SaaS uygulaması oluşturmak için herhangi bir yazılım kurmanıza gerek yoktur. Tek ihtiyacınız bir tarayıcı ve ne yapmak istediğinize dair kısa bir açıklamadır.</p>
<p>Bu rehberde sıfırdan bir <strong>görev yönetim uygulaması</strong> (task manager) oluşturacağız. Aynı adımları kendi projenize uygulayabilirsiniz.</p>

<h2>Adım 1: Hesap Oluşturun</h2>
<p>promptforgeai.dev adresine gidin ve <strong>"Ücretsiz Başla"</strong> butonuna tıklayın. Google hesabınızla tek tıkla kayıt olabilir ya da e-posta ve şifre ile hesap oluşturabilirsiniz.</p>
<p>Ücretsiz planda aylık <strong>3 üretim hakkı</strong> tanınır. Kredi kartı bilgisi istenmez.</p>

<h2>Adım 2: Yeni Proje Oluşturun</h2>
<p>Dashboard'a girdikten sonra <strong>"Yeni Proje"</strong> butonuna tıklayın. Karşınıza bir metin alanı çıkacak. Buraya uygulamanızı tanımlayan Türkçe bir açıklama yazacaksınız.</p>
<p>İyi bir prompt şu unsurları içerir:</p>
<ul>
  <li>Uygulamanın ana amacı</li>
  <li>Temel varlıklar (kullanıcı, ürün, sipariş vb.)</li>
  <li>Aralarındaki ilişkiler</li>
  <li>Öne çıkan özellikler</li>
</ul>
<p>Örnek prompt:</p>
<blockquote>
  <p>"Kullanıcıların görev oluşturabildiği, takım arkadaşlarına atayabildiği ve son tarihe göre filtreleyebildiği bir task yönetim uygulaması. Görevlerin durumu (bekliyor, devam ediyor, tamamlandı) takip edilebilsin. Her görevin öncelik seviyesi olsun."</p>
</blockquote>

<h2>Adım 3: Üretimi Başlatın</h2>
<p><strong>"Oluştur"</strong> butonuna tıklayın. PromptForge şunları yapar:</p>
<ol>
  <li>Promptunuzu analiz eder, varlıkları ve ilişkileri çıkarır</li>
  <li>Prisma veritabanı şemasını oluşturur</li>
  <li>Her varlık için NestJS modüllerini yazar</li>
  <li>JWT tabanlı kimlik doğrulama sistemini ekler</li>
  <li>Swagger API dokümantasyonunu yapılandırır</li>
  <li>Docker ve environment yapılandırma dosyalarını hazırlar</li>
</ol>
<p>Bu işlem ortalama <strong>15-30 saniye</strong> sürer.</p>

<h2>Adım 4: Projeyi İnceleyin</h2>
<p>Üretim tamamlandığında proje detay sayfasına yönlendirilirsiniz. Burada:</p>
<ul>
  <li>Oluşturulan <strong>Prisma şemasını</strong> görüntüleyebilirsiniz</li>
  <li>Hangi <strong>API endpoint</strong>'lerin oluşturulduğunu listeleyebilirsiniz</li>
  <li>Proje yapısını ve dosyaları inceleyebilirsiniz</li>
  <li>AI chat ile değişiklik isteyebilirsiniz</li>
</ul>

<h2>Adım 5: İndirin veya Deploy Edin</h2>
<p>Projenizi üç farklı yolla kullanıma alabilirsiniz:</p>
<ul>
  <li><strong>ZIP İndir:</strong> Tüm proje dosyalarını sıkıştırılmış arşiv olarak bilgisayarınıza indirin, lokalden çalıştırın.</li>
  <li><strong>GitHub'a Gönder:</strong> Tek tıkla yeni bir GitHub reposu oluşturun ve kodu oraya aktarın.</li>
  <li><strong>Railway Deploy:</strong> GitHub reponuzu Railway'e bağlayarak uygulamanızı birkaç dakika içinde canlıya alın.</li>
</ul>

<h2>Sonuç</h2>
<p>Hesap oluşturmadan projenizi indirmeye kadar geçen süre gerçekten 5 dakikanın altında olabilir. Üretilen kod gerçek bir NestJS projesidir — dilediğiniz gibi özelleştirebilir, genişletebilir ve production'a taşıyabilirsiniz.</p>
`,
  },

  // ─── 8 ────────────────────────────────────────────────────────────────────
  {
    slug: 'yapay-zeka-ile-uretilen-kodu-nasil-ozellestirirsiniz',
    title: 'Yapay Zeka ile Üretilen Kodu Nasıl Özelleştirirsiniz?',
    description:
      'PromptForge\'un ürettiği NestJS kodunu kendi ihtiyaçlarınıza göre uyarlamak için pratik ipuçları ve en iyi yöntemler.',
    category: 'PromptForge',
    readTime: 8,
    content: `
<h2>Üretilen Kod Bir Başlangıç Noktasıdır</h2>
<p>PromptForge'un ürettiği kod, üzerinde çalışılmaya hazır, derlenebilir bir NestJS projesidir. Ancak her uygulama özgündür; zamanla iş kurallarınız gelişir, yeni özellikler eklemeniz gerekir. Üretilen kodu kendi ihtiyaçlarınıza göre uyarlamak, geliştirme sürecinin doğal bir parçasıdır.</p>
<p>Bu yazıda, AI ile üretilmiş bir projeyi özelleştirmenin en etkili yollarını ele alacağız.</p>

<h2>1. AI Chat ile Değişiklik İsteyin</h2>
<p>En hızlı özelleştirme yöntemi, PromptForge dashboard'undaki <strong>AI chat</strong> özelliğini kullanmaktır. Mevcut projenizi açın ve değişikliği doğal dilde ifade edin:</p>
<ul>
  <li><em>"Kullanıcı profiline avatarUrl alanı ekle"</em></li>
  <li><em>"Görevler listelenirken pagination ekle, sayfa başına 20 kayıt olsun"</em></li>
  <li><em>"Yorum silme işlemini yalnızca yorum sahibi yapabilsin"</em></li>
</ul>
<p>AI chat, mevcut kodu anlayarak tutarlı değişiklikler üretir. Bu yöntem küçük ve orta büyüklükteki değişiklikler için idealdir.</p>

<h2>2. Prisma Şemasını Düzenleyin</h2>
<p>Veritabanı yapısını değiştirmek istiyorsanız <code>prisma/schema.prisma</code> dosyasını açın. Yeni bir alan eklemek şu kadar basittir:</p>
<pre><code>model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatarUrl String?  // Yeni eklenen alan
  bio       String?  // Yeni eklenen alan
  createdAt DateTime @default(now())
}</code></pre>
<p>Değişikliği yaptıktan sonra migration oluşturun:</p>
<pre><code>npx prisma migrate dev --name add-user-profile-fields</code></pre>

<h2>3. Servis Katmanına İş Mantığı Ekleyin</h2>
<p>NestJS projelerinde iş mantığı <code>*.service.ts</code> dosyalarında yer alır. Üretilen servis, temel CRUD işlemlerini içerir. Özel kurallarınızı buraya ekleyebilirsiniz:</p>
<pre><code>// tasks.service.ts — özel iş kuralı örneği
async assignTask(taskId: string, assigneeId: string, requesterId: string) {
  const task = await this.prisma.task.findUnique({ where: { id: taskId } });

  // Yalnızca proje sahibi atama yapabilsin
  if (task.projectOwnerId !== requesterId) {
    throw new ForbiddenException('Yalnızca proje sahibi görev atayabilir');
  }

  return this.prisma.task.update({
    where: { id: taskId },
    data: { assigneeId, status: 'IN_PROGRESS' },
  });
}</code></pre>

<h2>4. Yeni Modül Ekleyin</h2>
<p>Mevcut projeye tamamen yeni bir özellik eklemek için NestJS CLI'ı kullanabilirsiniz:</p>
<pre><code>nest generate module notifications
nest generate service notifications
nest generate controller notifications</code></pre>
<p>Bu komutlar boilerplate dosyaları oluşturur. Ardından yeni modülü <code>app.module.ts</code>'e dahil edin ve servis mantığını yazın.</p>

<h2>5. Middleware ve Guard Ekleyin</h2>
<p>Üretilen projede JWT guard zaten mevcuttur. Özel yetkilendirme kuralları için role-based guard ekleyebilirsiniz:</p>
<pre><code>// Kullanım örneği — controller'da
@Get('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
findAllUsers() {
  return this.usersService.findAll();
}</code></pre>

<h2>6. Environment Değişkenlerini Yapılandırın</h2>
<p>Üretilen proje <code>.env.example</code> dosyası içerir. Bunu kopyalayıp <code>.env</code> olarak adlandırın ve değerleri doldurun:</p>
<pre><code>DATABASE_URL="postgresql://user:password@localhost:5432/myapp"
JWT_SECRET="gizli-anahtar-buraya"
JWT_EXPIRES_IN="7d"
PORT=3000</code></pre>

<h2>İpuçları</h2>
<ul>
  <li><strong>Küçük adımlarla ilerleyin:</strong> Büyük değişiklikleri küçük parçalara bölün, her adımda test edin.</li>
  <li><strong>Prisma Studio kullanın:</strong> <code>npx prisma studio</code> komutuyla veritabanınızı görsel arayüzden yönetin.</li>
  <li><strong>Swagger'ı açık tutun:</strong> <code>/api</code> rotasındaki Swagger UI, endpoint'leri test etmek için en hızlı yoldur.</li>
  <li><strong>Git'i aktif kullanın:</strong> Her özellik için ayrı branch açın, çalışan durumu commit'leyin.</li>
</ul>

<h2>Sonuç</h2>
<p>Yapay zeka ile üretilen kod, özelleştirmeye kapalı bir kara kutu değildir. NestJS'in modüler mimarisi sayesinde üretilen projeyi istediğiniz yönde geliştirebilirsiniz. PromptForge sizi sıfırdan başlatmaktan kurtarır; siz de zamanınızı uygulamanızı gerçekten özgün kılan iş mantığına ayırırsınız.</p>
`,
  },

  // ─── 9 ────────────────────────────────────────────────────────────────────
  {
    slug: 'railway-tek-tikla-deploy-adim-adim-rehber',
    title: "Railway'e Tek Tıkla Deploy: Adım Adım Rehber",
    description:
      "PromptForge ile oluşturduğunuz NestJS backend'i Railway'e nasıl deploy edersiniz? GitHub entegrasyonundan canlı URL'ye kadar eksiksiz rehber.",
    category: 'PromptForge',
    readTime: 7,
    content: `
<h2>Railway Nedir?</h2>
<p><strong>Railway</strong>, modern uygulamalar için tasarlanmış bir bulut platform hizmetidir. Heroku'nun sadeliğini AWS'nin gücüyle birleştiren Railway, sunucu yapılandırmasıyla uğraşmadan uygulamanızı dakikalar içinde canlıya almanızı sağlar.</p>
<p>NestJS backend'ler için Railway özellikle avantajlıdır: PostgreSQL ve Redis gibi veritabanlarını tek tıkla ekleyebilir, environment değişkenlerini kolayca yönetebilir ve otomatik deploymentlar kurabilirsiniz.</p>

<h2>Ön Hazırlık: GitHub Reposu</h2>
<p>Railway deploy için projenizin bir GitHub reposunda bulunması gerekir. PromptForge dashboard'undan <strong>"GitHub'a Gönder"</strong> butonunu kullanarak projenizi otomatik olarak yeni bir repoya aktarabilirsiniz.</p>
<p>Manuel olarak yapmak isterseniz:</p>
<pre><code>git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/kullanici-adi/proje-adi.git
git push -u origin main</code></pre>

<h2>Adım 1: Railway Hesabı Oluşturun</h2>
<p>railway.app adresine gidin ve GitHub hesabınızla giriş yapın. GitHub ile giriş, repo bağlantısını çok daha kolay hale getirir.</p>
<p>Railway'in ücretsiz planı her ay <strong>5 dolar değerinde kaynak</strong> içerir. Küçük projeler ve test ortamları için bu genellikle yeterlidir.</p>

<h2>Adım 2: Yeni Proje Oluşturun</h2>
<ol>
  <li>Dashboard'da <strong>"New Project"</strong> butonuna tıklayın</li>
  <li><strong>"Deploy from GitHub repo"</strong> seçeneğini seçin</li>
  <li>İlgili GitHub reposunu listeden seçin</li>
  <li>Railway otomatik olarak projeyi analiz eder ve gerekli yapılandırmayı tahmin eder</li>
</ol>

<h2>Adım 3: PostgreSQL Ekleyin</h2>
<p>NestJS backend'iniz bir veritabanına ihtiyaç duyar. Railway projenizde:</p>
<ol>
  <li><strong>"New"</strong> butonuna tıklayın → <strong>"Database"</strong> → <strong>"Add PostgreSQL"</strong></li>
  <li>Railway otomatik olarak bir PostgreSQL instance oluşturur</li>
  <li>Oluşturulan <code>DATABASE_URL</code> değişkeni otomatik olarak ortam değişkenlerine eklenir</li>
</ol>

<h2>Adım 4: Environment Değişkenlerini Ekleyin</h2>
<p>Backend servisinizi seçin → <strong>Variables</strong> sekmesine gidin. Şu değişkenleri ekleyin:</p>
<table>
  <thead><tr><th>Değişken</th><th>Açıklama</th></tr></thead>
  <tbody>
    <tr><td><code>JWT_SECRET</code></td><td>Güvenli rastgele bir string (en az 32 karakter)</td></tr>
    <tr><td><code>JWT_EXPIRES_IN</code></td><td>Token geçerlilik süresi, örn: <code>7d</code></td></tr>
    <tr><td><code>NODE_ENV</code></td><td><code>production</code></td></tr>
    <tr><td><code>PORT</code></td><td><code>3000</code> (Railway otomatik yönetebilir)</td></tr>
  </tbody>
</table>
<p><code>DATABASE_URL</code> PostgreSQL eklediğinizde otomatik olarak tanımlanmıştır.</p>

<h2>Adım 5: Prisma Migration'ı Çalıştırın</h2>
<p>İlk deploy sonrası veritabanı tablolarını oluşturmanız gerekir. Railway shell üzerinden ya da <code>package.json</code>'a bir post-deploy komutu ekleyerek bunu yapabilirsiniz.</p>
<p><code>package.json</code>'a şunu ekleyin:</p>
<pre><code>"scripts": {
  "start:prod": "prisma migrate deploy && node dist/main",
}</code></pre>
<p>Bu sayede her deploy sırasında migration'lar otomatik uygulanır.</p>

<h2>Adım 6: Deploy ve Canlı URL</h2>
<p>Değişkenlerinizi kaydettiğinizde Railway otomatik olarak yeni bir deploy başlatır. Birkaç dakika içinde:</p>
<ul>
  <li>Uygulamanız build edilir</li>
  <li>Container başlatılır</li>
  <li>Size bir URL atanır: <code>https://proje-adi.up.railway.app</code></li>
</ul>
<p><strong>Settings → Domains</strong> bölümünden kendi domain adınızı bağlayabilirsiniz.</p>

<h2>Otomatik Deployment Kurulumu</h2>
<p>Railway varsayılan olarak GitHub'daki <code>main</code> branch'ine her push yapıldığında otomatik deploy tetikler. Bu sayede geliştirme süreciniz şu hale gelir:</p>
<ol>
  <li>Lokal ortamda kodu değiştirin</li>
  <li><code>git push origin main</code></li>
  <li>Railway otomatik build ve deploy yapar</li>
  <li>2-3 dakika içinde değişiklikler canlıda</li>
</ol>

<h2>Sonuç</h2>
<p>Railway, NestJS uygulamalarını canlıya almak için en az sürtünmeli platformlardan biridir. PromptForge ile ürettiğiniz kodu GitHub'a gönderin, Railway'e bağlayın — gerisini platform halleder.</p>
`,
  },

  // ─── 10 ───────────────────────────────────────────────────────────────────
  {
    slug: 'nestjs-boilerplate-vs-generator-hangisi-daha-iyi',
    title: 'NestJS Boilerplate vs. Generator: Hangisi Daha İyi?',
    description:
      'NestJS projesi başlatmak için hazır boilerplate mi kullanmalısınız yoksa kod üretici mi? Her yaklaşımın avantajlarını ve dezavantajlarını karşılaştırıyoruz.',
    category: 'Backend',
    readTime: 8,
    content: `
<h2>Problem: Her Yeni Projede Tekrarlayan Kurulum</h2>
<p>Deneyimli bir NestJS geliştiricisi yeni bir projeye başlarken aynı adımları tekrar tekrar atar: proje iskeletini oluştur, Prisma'yı kur, JWT modülünü ekle, config modülünü yapılandır, Swagger'ı entegre et, Docker dosyasını yaz... Bu kurulum süreci saatlerce sürebilir ve kodun tek satırı bile yazılmadan vakit harcanmış olur.</p>
<p>Bu sorunu çözmek için iki yaygın yaklaşım vardır: <strong>boilerplate repoları</strong> ve <strong>kod üreticiler (generators)</strong>.</p>

<h2>Boilerplate Nedir?</h2>
<p>Boilerplate, sık kullanılan yapılandırmaları içeren, klonlanıp başlangıç noktası olarak kullanılan bir proje şablonudur. GitHub'da "nestjs-boilerplate" araması yaptığınızda yüzlerce sonuçla karşılaşırsınız.</p>
<p><strong>Avantajları:</strong></p>
<ul>
  <li>Anında kullanılabilir, <code>git clone</code> yeterli</li>
  <li>Topluluk tarafından test edilmiş yapılandırmalar</li>
  <li>Kaynak kodu tamamen görünür, öğrenmek için idealdir</li>
  <li>İnternet bağlantısı gerektirmez</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
  <li>Projenizin ihtiyaçlarıyla birebir örtüşmeyebilir</li>
  <li>Gereksiz modüller ve bağımlılıklar içerebilir</li>
  <li>Güncel tutulması geliştiriciye bağlıdır</li>
  <li>Kendi ihtiyaçlarınıza göre özelleştirme yine zaman alır</li>
  <li>Varlık yapınızı (entities) kendiniz yazmanız gerekir</li>
</ul>

<h2>Kod Üretici (Generator) Nedir?</h2>
<p>Kod üreticiler, bir girdi (genellikle şema tanımı veya doğal dil açıklaması) alarak projeye özgü kaynak kodu üreten araçlardır. NestJS CLI'ın kendi üretecinden (<code>nest generate</code>) yapay zeka destekli platformlara kadar geniş bir yelpazeyi kapsar.</p>
<p><strong>Avantajları:</strong></p>
<ul>
  <li>Projenize özel kod üretir, gereksiz bileşen içermez</li>
  <li>Varlık modelleri ve API'lar otomatik oluşturulur</li>
  <li>Tutarlı kod stili ve mimari kararlar</li>
  <li>Başlangıç süresini önemli ölçüde kısaltır</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
  <li>Üretilen kodu anlamak için NestJS bilgisi gerektirir</li>
  <li>Çok özgün iş mantığı otomatik üretilemez</li>
  <li>Araca bağımlılık oluşabilir</li>
</ul>

<h2>Tarafsız Karşılaştırma</h2>
<table>
  <thead>
    <tr><th>Kriter</th><th>Boilerplate</th><th>Generator (PromptForge)</th></tr>
  </thead>
  <tbody>
    <tr><td>Kurulum süresi</td><td>15-60 dk</td><td>1-3 dk</td></tr>
    <tr><td>Projeye özgünlük</td><td>Düşük</td><td>Yüksek</td></tr>
    <tr><td>Öğrenme değeri</td><td>Yüksek</td><td>Orta</td></tr>
    <tr><td>Varlık modeli üretimi</td><td>Manuel</td><td>Otomatik</td></tr>
    <tr><td>Güncel kalma</td><td>Repo sahibine bağlı</td><td>Platform tarafından yönetilir</td></tr>
    <tr><td>Özelleştirme esnekliği</td><td>Tam</td><td>Tam (üretim sonrası)</td></tr>
  </tbody>
</table>

<h2>Hangi Durumda Hangisini Kullanmalısınız?</h2>
<p><strong>Boilerplate tercih edin:</strong></p>
<ul>
  <li>NestJS öğrenmek istiyorsanız ve yapıyı adım adım anlamak istiyorsanız</li>
  <li>Ekibinizin uzun süredir kullandığı, iyi bildiği bir şablon varsa</li>
  <li>İnternet erişimi olmayan ortamlarda çalışıyorsanız</li>
</ul>
<p><strong>Generator (PromptForge) tercih edin:</strong></p>
<ul>
  <li>Hızlı MVP geliştirmeniz gerekiyorsa</li>
  <li>Varlık yapınız karmaşık ve çok sayıda model içeriyorsa</li>
  <li>Backend bilginiz sınırlıysa ama çalışan bir API'a ihtiyacınız varsa</li>
  <li>Rutin kurulum kodunu otomatize etmek ve asıl iş mantığına odaklanmak istiyorsanız</li>
</ul>

<h2>Karma Yaklaşım: En İyi Sonuç</h2>
<p>Pratikte en verimli yaklaşım ikisini birleştirmektir: PromptForge ile projeye özgü bir iskelet oluşturun, ardından bunu ekibinizin standartlarına göre özelleştirin. Bu yaklaşım hem hız hem de esneklik sağlar.</p>

<h2>Sonuç</h2>
<p>"Hangisi daha iyi?" sorusunun tek bir cevabı yoktur — bağlama göre değişir. Ancak zaman kısıtı olan, projeye özgü bir başlangıç noktası isteyen geliştiriciler için kod üreticiler giderek daha güçlü bir seçenek haline gelmektedir.</p>
`,
  },

  // ─── 11 ───────────────────────────────────────────────────────────────────
  {
    slug: 'turkiyede-saas-girisimi-kurmak-2026-rehberi',
    title: "Türkiye'de SaaS Girişimi Kurmak: 2026 Rehberi",
    description:
      "Türkiye'de SaaS işi kurarken dikkat etmeniz gereken yasal, teknik ve pazarlama konularını ele alan kapsamlı bir rehber.",
    category: 'Girişim',
    readTime: 10,
    content: `
<h2>Neden SaaS?</h2>
<p>SaaS (Software as a Service) iş modeli, yazılım girişimcileri için en ölçeklenebilir modellerden biridir. Bir kez geliştirip defalarca satabileceğiniz bir ürün; düşük marjinal maliyet, tekrarlayan gelir (recurring revenue) ve global erişim. Türkiye'de bu modele olan ilgi 2024'ten bu yana hızla artmaktadır.</p>
<p>Bu rehberde Türkiye merkezli bir SaaS girişimi kurarken karşılaşacağınız teknik, yasal ve iş geliştirme boyutlarını ele alacağız.</p>

<h2>1. Fikir Doğrulama</h2>
<p>En pahalı hata, kimsenin istemediği bir ürünü aylar boyu geliştirmektir. Fikrinizi piyasaya sürmeden önce şu soruları yanıtlayın:</p>
<ul>
  <li><strong>Kim için?</strong> Hedef kitlenizi mümkün olduğunca dar tanımlayın. "KOBİ'ler için" değil, "İstanbul'daki 5-20 çalışanlı e-ticaret firmaları için" gibi.</li>
  <li><strong>Hangi sorunu çözüyor?</strong> Para ya da zaman kaybettiren, tekrarlayan bir sorun mu? İnsanlar bu sorun için şu an ne kullanıyor?</li>
  <li><strong>Ödeme isteği var mı?</strong> En az 10 potansiyel müşteriyle görüşün. "Kullanırdım" demek ödeme yapmak değildir.</li>
</ul>
<p>Doğrulama için önce bir landing page oluşturun, e-posta toplama formu ekleyin ve reklam yayınlayın. Ürün geliştirmeden önce talep olduğunu kanıtlayın.</p>

<h2>2. Teknik Altyapı</h2>
<p>Türkiye'de SaaS kurarken teknik tercihleriniz ölçeklenebilirliğinizi belirler.</p>
<p><strong>Önerilen teknoloji yığını:</strong></p>
<ul>
  <li><strong>Backend:</strong> NestJS + Prisma + PostgreSQL — ölçeklenebilir, tip güvenli, topluluk desteği güçlü</li>
  <li><strong>Frontend:</strong> Next.js — SEO dostu, performanslı, Vercel ile kolay deploy</li>
  <li><strong>Hosting:</strong> Railway (backend + DB) + Vercel (frontend) — düşük maliyet, yüksek kullanılabilirlik</li>
  <li><strong>E-posta:</strong> Resend — modern API, güvenilir teslimat</li>
  <li><strong>Ödeme:</strong> iyzico (Türkiye) veya Stripe (global) — her ikisi de SaaS abonelik modelini destekler</li>
</ul>

<h2>3. Yasal Gereksinimler</h2>
<p>Türkiye'de dijital hizmet satan bir girişim için şu yasal yükümlülükler geçerlidir:</p>
<p><strong>Şirket kuruluşu:</strong></p>
<ul>
  <li>Limited şirket (Ltd. Şti.) en yaygın tercih. Minimum sermaye 10.000 TL.</li>
  <li>Anonim şirket (A.Ş.) yatırım almayı kolaylaştırır ancak kurulumu daha karmaşıktır.</li>
  <li>Şahıs şirketi düşük maliyetli başlangıç için uygun ancak yatırımcı çekmek güçleşir.</li>
</ul>
<p><strong>KVKK (Kişisel Verilerin Korunması Kanunu):</strong></p>
<ul>
  <li>Kullanıcılardan kişisel veri topluyorsanız KVKK kapsamında Veri Sorumlusu olarak kaydolmanız gerekebilir.</li>
  <li>Gizlilik politikası ve aydınlatma metni zorunludur.</li>
  <li>Veri ihlali bildirim yükümlülüğü: 72 saat içinde KVKK Kurulu'na bildirim.</li>
</ul>
<p><strong>Mesafeli satış:</strong></p>
<ul>
  <li>Dijital hizmet satıyorsanız Mesafeli Sözleşmeler Yönetmeliği kapsamında ön bilgilendirme formu ve mesafeli satış sözleşmesi zorunludur.</li>
  <li>İade koşullarını açıkça belirtin. SaaS'ta genellikle 14 günlük cayma hakkı uygulanır.</li>
</ul>

<h2>4. Fiyatlandırma Stratejisi</h2>
<p>Türkiye pazarında SaaS fiyatlandırması için yaygın yaklaşımlar:</p>
<ul>
  <li><strong>Freemium:</strong> Ücretsiz temel plan + ücretli premium özellikler. Kullanıcı edinme maliyetini düşürür ancak dönüşüm oranına dikkat edin.</li>
  <li><strong>Deneme süreli:</strong> 14 veya 30 günlük ücretsiz deneme. Kredi kartı gerektirmeden sunmak dönüşümü artırır.</li>
  <li><strong>Kullanım bazlı:</strong> API çağrısı, işlem sayısı veya kullanıcı başına ücretlendirme. Büyüyen müşterilerle birlikte geliriniz de büyür.</li>
</ul>
<p>Fiyatlandırmanızda TRY/USD seçimi önemlidir. TRY fiyatlandırma yerel pazarda algı yönetimini kolaylaştırır; USD ise döviz riskini azaltır ve global müşteriler için standart bir görünüm sunar.</p>

<h2>5. Pazarlama ve Müşteri Edinme</h2>
<p><strong>İçerik pazarlaması:</strong> Hedef kitlenizin arama yaptığı konularda blog yazıları ve rehberler hazırlayın. Organik trafik, uzun vadede en düşük maliyetli müşteri edinme kanalıdır.</p>
<p><strong>SEO:</strong> Google Türkiye'de arama hacmi olan anahtar kelimeleri belirleyin. Teknik SEO (site hızı, schema markup) ve içerik SEO'sunu birlikte yürütün.</p>
<p><strong>Topluluk:</strong> LinkedIn, Twitter/X ve sektörel Discord/Slack toplulukları Türkiye'de SaaS girişimcileri için önemli kanallar haline gelmiştir.</p>
<p><strong>Referans programı:</strong> Mevcut kullanıcılarınızın yeni müşteri getirmesini teşvik edin. SaaS'ta en düşük maliyetli büyüme genellikle ağızdan ağıza yayılmadan gelir.</p>

<h2>6. Metrikler ve Büyüme</h2>
<p>SaaS işinizi yönetirken takip etmeniz gereken temel metrikler:</p>
<ul>
  <li><strong>MRR (Monthly Recurring Revenue):</strong> Aylık tekrarlayan gelir. İşinizin gerçek büyüklüğünü gösterir.</li>
  <li><strong>Churn Rate:</strong> Aylık iptal oranı. %5'in altında tutmak hedeflenmelidir.</li>
  <li><strong>LTV (Lifetime Value):</strong> Bir müşterinin ömür boyu getirdiği ortalama gelir.</li>
  <li><strong>CAC (Customer Acquisition Cost):</strong> Bir müşteri edinmenin maliyeti. LTV &gt; 3×CAC olmalıdır.</li>
  <li><strong>NPS (Net Promoter Score):</strong> Kullanıcı memnuniyeti ve önerme isteği.</li>
</ul>

<h2>Sonuç</h2>
<p>Türkiye'de SaaS girişimi kurmak, doğru araçlar ve stratejiyle 2026'da her zamankinden daha erişilebilir. Fikrinizi hızla doğrulayın, MVP'nizi PromptForge gibi araçlarla hızla hayata geçirin ve öğrendikçe ürününüzü geliştirin. En büyük risk, mükemmel olmayı beklerken başlamamaktır.</p>
`,
  },

  // ─── 12 ───────────────────────────────────────────────────────────────────
  {
    slug: 'docker-ile-nestjs-uygulamasi-nasil-containerize-edilir',
    title: 'Docker ile NestJS Uygulaması Nasıl Containerize Edilir?',
    description:
      'NestJS uygulamanızı Docker ile paketleme, multi-stage build ile image boyutunu küçültme ve docker-compose ile lokal geliştirme ortamı kurma rehberi.',
    category: 'Backend',
    readTime: 9,
    content: `
<h2>Neden Docker?</h2>
<p>Docker, uygulamanızı bağımlılıkları ve yapılandırmasıyla birlikte taşınabilir bir container içine paketlemenizi sağlar. "Bende çalışıyordu" sorununu ortadan kaldırır; lokal geliştirme ortamı, CI/CD pipeline'ı ve production sunucusu aynı ortamda çalışır.</p>
<p>NestJS uygulamaları için Docker özellikle değerlidir çünkü:</p>
<ul>
  <li>Node.js versiyonu farklı sunucularda bile tutarlı çalışma garantisi</li>
  <li>PostgreSQL, Redis gibi servislerin docker-compose ile tek komutla ayağa kaldırılması</li>
  <li>Railway, Render, Fly.io gibi platformlara kolay deploy</li>
  <li>Yatay ölçeklendirme (multiple containers) kolaylığı</li>
</ul>

<h2>Temel Dockerfile</h2>
<p>NestJS için basit bir Dockerfile:</p>
<pre><code>FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]</code></pre>
<p>Bu Dockerfile çalışır ancak üretim için optimize edilmemiştir. Image boyutu gereksiz yere büyük olacak ve <code>node_modules</code>'un tamamı dahil edilecektir.</p>

<h2>Multi-Stage Build ile Optimizasyon</h2>
<p>Multi-stage build, build sürecini birden fazla aşamaya böler. Son image yalnızca çalıştırmak için gereken dosyaları içerir:</p>
<pre><code># ── Aşama 1: Bağımlılık kurulumu ─────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Aşama 2: Build ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Aşama 3: Production image ─────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Yalnızca gerekli dosyaları kopyala
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main"]</code></pre>
<p>Bu yapı ile image boyutu %40-60 oranında küçülür.</p>

<h2>.dockerignore Dosyası</h2>
<p>Build context'e gereksiz dosyaların dahil edilmesini önlemek için <code>.dockerignore</code> oluşturun:</p>
<pre><code>node_modules
dist
.env
.env.*
.git
.gitignore
README.md
*.log</code></pre>

<h2>docker-compose ile Lokal Geliştirme Ortamı</h2>
<p>NestJS backend'i, PostgreSQL ve Redis'i birlikte ayağa kaldırmak için <code>docker-compose.yml</code>:</p>
<pre><code>version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
      JWT_SECRET: local-dev-secret
      NODE_ENV: development
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src  # Hot reload için

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:</code></pre>
<p>Başlatmak için:</p>
<pre><code>docker-compose up -d</code></pre>
<p>Durdurmak için:</p>
<pre><code>docker-compose down</code></pre>

<h2>Prisma Migration ile Entegrasyon</h2>
<p>Container başlarken migration'ların otomatik çalışmasını sağlamak için bir entrypoint script kullanabilirsiniz:</p>
<pre><code>#!/bin/sh
# entrypoint.sh
set -e

echo "Prisma migration çalıştırılıyor..."
npx prisma migrate deploy

echo "Uygulama başlatılıyor..."
exec node dist/main</code></pre>
<p>Dockerfile'da:</p>
<pre><code>COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]</code></pre>

<h2>Production İçin Güvenlik Notları</h2>
<ul>
  <li><strong>Root olmayan kullanıcı:</strong> Container'ı root ile çalıştırmayın. <code>USER node</code> direktifi ekleyin.</li>
  <li><strong>Secret yönetimi:</strong> Environment değişkenlerini <code>.env</code> dosyasından değil, platform'un secret yönetiminden alın (Railway Variables, AWS Secrets Manager vb.).</li>
  <li><strong>Health check:</strong> <code>HEALTHCHECK</code> direktifi ile container sağlık durumunu izleyin.</li>
  <li><strong>Read-only filesystem:</strong> Mümkünse <code>--read-only</code> flag'i ile container çalıştırın.</li>
</ul>

<h2>PromptForge ile Üretilen Projelerde Docker</h2>
<p>PromptForge'un ürettiği NestJS projeleri bir <code>Dockerfile</code> ve <code>docker-compose.yml</code> içerir. Bu dosyaları doğrudan kullanabilir ya da bu rehberdeki optimizasyonları uygulayarak geliştirebilirsiniz.</p>

<h2>Sonuç</h2>
<p>Docker, NestJS uygulamalarını paketlemenin endüstri standardı haline gelmiştir. Multi-stage build ile optimize edilmiş bir image ve docker-compose ile yönetilen lokal geliştirme ortamı, ekibinizin verimliliğini önemli ölçüde artırır ve production'a geçişi güvenilir hale getirir.</p>
`,
  },
];

async function main() {
  console.log('Blog yazıları ekleniyor...\n');

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`⏭  Zaten var, atlanıyor: ${post.title}`);
      continue;
    }
    await prisma.blogPost.create({ data: post });
    console.log(`✅ Eklendi: ${post.title}`);
  }

  console.log('\nTamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
