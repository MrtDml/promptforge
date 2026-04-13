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
