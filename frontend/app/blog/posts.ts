export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: number; // minutes
  category: string;
  content: string; // HTML
}

export const posts: BlogPost[] = [
  {
    slug: "build-saas-with-ai-in-5-minutes",
    title: "5 Dakikada AI ile SaaS Uygulaması Nasıl Kurulur",
    description:
      "Haftalarca boilerplate'le uğraşmayı bırakın. AI kod üretiminin sizi bir fikirden dakikalar içinde üretime hazır NestJS + PostgreSQL backend'ine nasıl götürdüğünü öğrenin.",
    date: "2026-03-15",
    readTime: 6,
    category: "Eğitim",
    content: `
<p>Sıfırdan SaaS uygulaması geliştirmek her zaman zahmetli olmuştur. İş mantığına dair tek bir satır yazmadan önce kimlik doğrulama, veritabanı şemaları, API yönlendirme, Docker yapılandırması ve dokümantasyon için günler — bazen haftalar — harcarsınız. Bu çalışmaların büyük çoğunluğu her projede aynıdır.</p>

<p>AI kod üretimi bunu değiştiriyor. PromptForge ile fikrinizi sade bir Türkçe veya İngilizce ile anlatıyor, beş dakika içinde eksiksiz ve üretime hazır bir NestJS backend alıyorsunuz. İşte tam olarak nasıl çalıştığı.</p>

<h2>Adım 1: Fikrinizi Anlatın</h2>

<p>Net ve somut bir açıklama ile başlayın. Ne kadar spesifik olursanız çıktı o kadar iyi olur. "Proje yönetim aracı yap" yerine şunu deneyin:</p>

<blockquote>"Kullanıcı kimlik doğrulaması, çalışma alanları, öncelikler ve bitiş tarihleri olan görevler, takım üyesi davetleri ve Kanban panosu görünümü içeren bir proje yönetim SaaS'ı. Kullanıcılar görevleri takım arkadaşlarına atayabilmeli ve görevler güncellendiğinde bildirim alabilmelidir."</blockquote>

<p>PromptForge bunu yapılandırılmış bir şemaya dönüştürür — entity'leri (Kullanıcı, Çalışma Alanı, Proje, Görev, Davet), ilişkilerini ve üretilmesi gereken özellikleri belirler.</p>

<h2>Adım 2: Şemayı İnceleyin</h2>

<p>Kod üretmeden önce PromptForge size ayrıştırılmış veri modelini gösterir. Amacınızı doğru anlayıp anlamadığını doğrulayabilirsiniz:</p>

<ul>
  <li><strong>Entity'ler</strong>: Kullanıcı, Çalışma Alanı, Proje, Görev, Davet</li>
  <li><strong>İlişkiler</strong>: Kullanıcı → çok Görev (atanmış), Çalışma Alanı → çok Proje</li>
  <li><strong>Tespit edilen özellikler</strong>: kimlik doğrulama, crud, api, bildirimler</li>
</ul>

<p>Bu adım sürprizleri önler. Bir şey yanlış giderse istemi birkaç saniyede düzenleyip yeniden ayrıştırırsınız.</p>

<h2>Adım 3: Üretin</h2>

<p>Üret'e tıklayın ve yaklaşık 30–60 saniye bekleyin. PromptForge eksiksiz bir proje iskeleti çıkarır:</p>

<ul>
  <li>Her entity için NestJS modülleri (controller'lar, service'ler, DTO'lar, doğrulama)</li>
  <li>Tüm ilişkiler ve migration'larla birlikte Prisma şeması</li>
  <li>Refresh token'lı JWT kimlik doğrulama</li>
  <li>Otomatik oluşturulan Swagger/OpenAPI dokümantasyonu</li>
  <li>Yerel geliştirme için Docker Compose</li>
  <li>Ortam değişkeni şablonu (.env.example)</li>
</ul>

<h2>Adım 4: İndirin ve Çalıştırın</h2>

<p>ZIP'i indirin, çıkarın ve çalıştırın:</p>

<pre><code>npm install
npx prisma migrate dev
npm run start:dev</code></pre>

<p>API'niz hazır ve çalışıyor. Üretilen Postman koleksiyonunu içe aktarın; her endpoint'e anında istek atabilirsiniz.</p>

<h2>Yazmadığınız Şeyler</h2>

<p>Tipik bir projede bu boilerplate'i doğru şekilde yazmak 3–5 gün sürer — guard'lar, pipe'lar, interceptor'lar, hata yönetimi ve testler dahil. AI üretimi bunların tümünü ortadan kaldırır. Ürününüzü gerçekten farklı kılan mantığı birinci günden yazmaya başlarsınız.</p>

<h2>AI Üretimi Ne Zaman Mantıklı?</h2>

<p>Bu yaklaşım şu durumlarda en iyi çalışır:</p>
<ul>
  <li>Haftalarca mühendislik yatırımı yapmadan önce yeni bir ürün fikrini hızla doğrulamak</li>
  <li>Erken müşteri geri bildirimi için MVP oluşturmak</li>
  <li>Mikro servis mimarisinde yeni bir servis başlatmak</li>
  <li>Projeleri daha hızlı teslim etmesi gereken freelancer'lar</li>
</ul>

<p>Karmaşık mimari kararlar için deneyimli bir mühendis yargısının yerini tutmaz. Ancak köklü kalıpları izleyen SaaS uygulamalarının %80'i için AI üretimi size koşan bir başlangıç verir.</p>

<p>Bir sonraki projenizde <a href="https://promptforgeai.dev">promptforgeai.dev</a> adresinde deneyin. Ücretsiz plan, fikrinizi doğrulamak için yeterli olan üç tam üretim hakkı verir.</p>
    `,
  },

  {
    slug: "nestjs-boilerplate-vs-generator",
    title: "NestJS Boilerplate ve AI Üretici: Hangisini Kullanmalısınız?",
    description:
      "Geleneksel NestJS boilerplate yaklaşımını AI destekli kod üretimiyle karşılaştırıyoruz. Her birini ne zaman kullanmalı ve gerçek trade-off'lar neler.",
    date: "2026-03-08",
    readTime: 7,
    category: "Mühendislik",
    content: `
<p>Yeni bir NestJS projesi başlatırken geliştiriciler tanıdık bir kararla karşılaşır: bir boilerplate deposu klonlamak mı, yoksa sıfırdan ihtiyaç duyduklarını oluşturmak mı? Şimdi üçüncü bir seçenek var: AI kod üretimi. Üçünü de dürüstçe inceleyelim.</p>

<h2>Geleneksel Boilerplate</h2>

<p><code>nestjs/typescript-starter</code> veya <code>nestjs-boilerplate</code> gibi topluluk depoları size makul varsayılanlarla hızlı bir başlangıç sağlar. Tipik içerikler:</p>

<ul>
  <li>NestJS kurallarına uygun modül yapısı</li>
  <li>TypeORM veya Prisma kurulumu</li>
  <li>JWT kimlik doğrulama iskeleti</li>
  <li>Ortam değişkeni yönetimi</li>
  <li>Temel test kurulumu</li>
</ul>

<p><strong>Sorun şu:</strong> Boilerplate'ler geneldir. Sizin entity'lerinizi, iş kurallarınızı veya özellik kümenizi bilmez. Klonladıktan sonra, ihtiyaç duymadıklarınızı silmek ve ihtiyaç duyduklarınızı eklemek için saatler harcarsınız. Boilerplate TypeORM kullanıyorsa ve siz Prisma istiyorsanız, ya da class-validator kullanıyorsa siz Zod'u tercih ediyorsanız, tek bir satır iş mantığı yazmadan önce yeniden yapılandırıyorsunuzdur.</p>

<h2>Sıfırdan Oluşturmak</h2>

<p>Güçlü NestJS deneyimine sahip ekipler, CLI kullanarak sıfırdan oluşturmayı tercih eder:</p>

<pre><code>nest new my-app
nest generate module users
nest generate controller users
nest generate service users</code></pre>

<p>Bu tam kontrol sağlar. Her karar bilinçlidir. Ancak beş veya altı entity'li orta karmaşıklıkta bir SaaS için, ilginç çalışmaya başlamadan önce iki ila üç günlük kurulum süresine bakıyorsunuzdur. Bu da başlangıçta tam olarak ne inşa ettiğinizi bildiğinizi varsayar.</p>

<h2>AI Kod Üretimi</h2>

<p>AI üretimi bu yaklaşımlar arasında bir yerde durur. Uygulamanızı doğal dilde tanımlarsınız, üretici size özelleştirilmiş bir iskelet oluşturur — genel değil, ama elle yapılmış da değil.</p>

<p>Boilerplate'ten temel fark: çıktı etki alanı modelinizle örtüşür. Oluşturulan Prisma şeması sizin entity'lerinizi ve ilişkilerinizi içerir. Oluşturulan modüller, controller'lar ve service'ler bu entity'lerle örtüşür. Swagger dokümantasyonu gerçek API'nizi açıklar.</p>

<p><strong>İyi yaptığı şeyler:</strong></p>
<ul>
  <li>Standart kalıplar için sıfır yapılandırma (CRUD, kimlik doğrulama, ilişkiler)</li>
  <li>Tüm modüllerde tutarlı kod yapısı</li>
  <li>Kodun yanında dokümantasyon üretir</li>
  <li>Temizlik gerekmez — sadece istediğiniz şeyi alırsınız</li>
</ul>

<p><strong>Sınırlamalar:</strong></p>
<ul>
  <li>Karmaşık iş mantığının hâlâ elle yazılması gerekir</li>
  <li>Son derece standart dışı gereksinimler üreticinin kalıplarına uymayabilir</li>
  <li>Oluşturulan kodu etkili şekilde genişletmek için onu anlamanız gerekir</li>
</ul>

<h2>Doğru Seçim</h2>

<p>Yanıt durumunuza bağlıdır:</p>

<ul>
  <li><strong>Boilerplate kullanın</strong> kurulum hakkında güçlü tercihleriniz varsa ve birinci günden tam kontrolü istiyorsanız.</li>
  <li><strong>Sıfırdan oluşturun</strong> uygulamanın olağandışı mimari gereksinimleri varsa veya ekibinizin derin NestJS uzmanlığı ve harcayacak zamanı varsa.</li>
  <li><strong>AI üretimi kullanın</strong> standart bir SaaS kalıbı inşa ediyorsanız, hızlı hareket etmeniz gerekiyorsa veya özel mimariye yatırım yapmadan önce bir fikri doğrulamak istiyorsanız.</li>
</ul>

<p>Çoğu ürün ekibi ve solo kurucu için AI üretimi, çıktı kalitesinden ödün vermeden hız açısından kazanır. Oluşturulan kod NestJS en iyi pratiklerini izler, Prisma (Node.js ORM'leri için mevcut topluluk standardı) kullanır ve deneyimli mühendislerin sorunsuzca genişletebileceği temiz, okunabilir kod üretir.</p>
    `,
  },

  {
    slug: "prisma-schema-generator-guide",
    title: "Prisma Şemalarını Otomatik Oluşturma: Pratik Bir Kılavuz",
    description:
      "Prisma şemalarını elle yazmayı bırakın. AI şema üretiminin nasıl çalıştığını, neyi doğru yaptığını ve edge case'leri nasıl yöneteceğinizi öğrenin.",
    date: "2026-02-24",
    readTime: 5,
    category: "Eğitim",
    content: `
<p>Prisma, Node.js ve TypeScript projeleri için baskın ORM haline geldi — bunun iyi nedenleri var. Şema dili okunabilir, migration sistemi güvenilir ve Prisma Client kutunun dışında tip güvenli veritabanı erişimi sağlıyor.</p>

<p>Ancak birden fazla entity, ilişki ve kısıtlamaya sahip yeni bir proje için Prisma şemalarını elle yazmak sıkıcıdır. İlişki sözdizimini tam olarak doğru almanız, yabancı anahtarlar için indeks eklemeyi hatırlamanız ve alan türlerinizin hedef veritabanıyla doğru eşleştiğinden emin olmanız gerekir. AI üretimi bunların tümünü halledebilir.</p>

<h2>Oluşturulan Şema Nasıl Görünür</h2>

<p>Kullanıcılar, takımlar ve projeler içeren bir SaaS uygulaması için şunu tanımlayabilirsiniz:</p>

<blockquote>"Kullanıcılar bir takıma aittir. Takımların çok sayıda projesi vardır. Projelerin kullanıcılara atanabilen görevleri vardır."</blockquote>

<p>Oluşturulan şema:</p>

<pre><code>model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  teamId    String
  team      Team     @relation(fields: [teamId], references: [id])
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([teamId])
  @@map("users")
}

model Team {
  id        String    @id @default(cuid())
  name      String
  users     User[]
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("teams")
}

model Project {
  id        String   @id @default(cuid())
  name      String
  teamId    String
  team      Team     @relation(fields: [teamId], references: [id])
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([teamId])
  @@map("projects")
}

model Task {
  id          String   @id @default(cuid())
  title       String
  completed   Boolean  @default(false)
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assigneeId  String?
  assignee    User?    @relation(fields: [assigneeId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([projectId])
  @@index([assigneeId])
  @@map("tasks")
}</code></pre>

<p>Üreticinin otomatik olarak yönettiği ayrıntılara dikkat edin: CUID tanımlayıcılar, her modelde zaman damgaları, her yabancı anahtarda indeks, uygun yerlerde cascade silme, null olabilen isteğe bağlı ilişkiler ve tablo adı eşleme.</p>

<h2>Üretimden Sonra Gözden Geçirilecekler</h2>

<p>AI üretimi yapıyı güvenilir biçimde doğru yapar. Bu alanları elle gözden geçirin:</p>

<ul>
  <li><strong>Cascade davranışı</strong>: <code>onDelete</code> kurallarının veri saklama gereksinimlerinizle örtüşüp örtüşmediğini kontrol edin.</li>
  <li><strong>Benzersiz kısıtlamalar</strong>: Belirli alan kombinasyonlarının benzersiz olması gerekiyorsa (ör. takım başına bir kullanıcı), <code>@@unique</code>'i elle ekleyin.</li>
  <li><strong>Enum değerleri</strong>: Oluşturulan enum'lar makul varsayılanlar kullanır; etki alanı sözlüğünüze uyması için değerleri özelleştirin.</li>
  <li><strong>İndeksler</strong>: Yoğun trafik alan tablolar için sık filtrelediğiniz alanlara indeks eklemeyi düşünün (ör. <code>status</code>, <code>createdAt</code>).</li>
</ul>

<h2>Migration Çalıştırmak</h2>

<p>Şemadan memnun olduğunuzda, standart Prisma yöntemiyle migration'ları çalıştırın:</p>

<pre><code>npx prisma migrate dev --name init</code></pre>

<p>Oluşturulan Prisma şeması geçerli ve üretime hazır bir başlangıç noktasıdır. Gereksinimler geliştikçe onu genişleteceksiniz — ancak sıkıcı temeli elle yazmak zorunda kalmayacaksınız.</p>
    `,
  },

  {
    slug: "promptforge-vs-lovable-bolt-v0",
    title: "PromptForge vs Lovable vs Bolt.new vs v0: Backend Geliştiriciler İçin Hangi AI Builder?",
    description:
      "Büyük AI kod üretim araçlarının dürüst bir karşılaştırması. Backend geliştiriciler hangisini seçmeli ve farklar neden pazarlamadan daha önemli?",
    date: "2026-02-10",
    readTime: 8,
    category: "Karşılaştırma",
    content: `
<p>AI kod üretim alanı kalabalık. Lovable, Bolt.new, v0 by Vercel ve PromptForge hepsi açıklamalarınızı çalışan uygulamalara dönüştürmeyi vaat ediyor. Ancak çok farklı trade-off'lar yapıyorlar; kullanım durumunuz için yanlış aracı seçmek zaman kazandırmak yerine kaybettirir.</p>

<h2>Her Araç Neye Odaklanıyor</h2>

<p><strong>v0 by Vercel</strong> bir UI bileşen üreticisidir. Bir bileşeni tanımlarsınız, React/Tailwind kodu alırsınız. Yaptığı şeyde mükemmeldir — temiz frontend bileşenleri üretmek — ancak backend'inize, veritabanınıza veya deployment'ınıza dokunmaz. Tam yığın bir builder değil, uzman bir araçtır.</p>

<p><strong>Lovable</strong>, tek satır kod yazmadan eksiksiz bir uygulama oluşturmak isteyen teknik olmayan kurucuları hedefler. Görsel bir arayüzle tam yığın uygulamalar üretir ve deployment'ı yönetir. Trade-off: çıktı kilitli bir platformdur. Oluşturulan kodu kolayca alıp mimariyi değiştirip kendiniz deploy edemezsiniz. Lovable'ın altyapısı üzerine inşa ediyorsunuzdur.</p>

<p><strong>Bolt.new</strong>, tarayıcıda tam bir geliştirme ortamı çalıştırarak uygulamaları etkileşimli biçimde tanımlamanıza ve üzerinde yineleme yapmanıza olanak tanır. Hızlı prototipleme için etkileyicidir. Çıktı Lovable'ınkinden daha özelleştirilebilir; ancak odak, üretime hazır backend kodu üretmek yerine tarayıcı tabanlı yinelemeye yöneliktir.</p>

<p><strong>PromptForge</strong>, prototip değil üretime hazır backend'e ihtiyaç duyan geliştiricileri hedefler. Çıktı; Prisma, JWT kimlik doğrulama, Swagger dokümantasyonu ve Docker içeren standart NestJS kodudur — tamamen size ait, istediğiniz yerde deploy edebileceğiniz ve standart geliştirme araçlarıyla genişletebileceğiniz kod.</p>

<h2>Temel Ayrım: Kod Sahipliği</h2>

<p>Bu en önemli farklılaştırıcıdır. PromptForge ile kod ürettiğinizde projenizi içeren bir ZIP dosyası alırsınız. Bu size aittir. Railway, Render, AWS, kendi sunucunuzda — istediğiniz yerde deploy edin. Editörünüzde değiştirin. Yerel olarak çalıştırın. Sürüm kontrolüne ekleyin. Kendiniz yazdığınız kod gibi davranır.</p>

<p>Lovable gibi platformlar bunu soyutlar. Bu, teknik olmayan kullanıcılar için bir özelliktir; ancak altyapıları, bağımlılıkları ve deployment pipeline'ları üzerinde kontrol isteyen geliştiriciler için bir kısıtlamadır.</p>

<h2>Backend ve Frontend Odağı</h2>

<table>
  <thead>
    <tr><th>Araç</th><th>Backend</th><th>Frontend</th><th>Veritabanı</th><th>Deploy</th></tr>
  </thead>
  <tbody>
    <tr><td>PromptForge</td><td>✅ NestJS</td><td>İsteğe bağlı</td><td>✅ Prisma + PG</td><td>Her yer</td></tr>
    <tr><td>Lovable</td><td>Sınırlı</td><td>✅ React</td><td>Supabase</td><td>Lovable platformu</td></tr>
    <tr><td>Bolt.new</td><td>Temel</td><td>✅ React</td><td>Temel</td><td>Manuel</td></tr>
    <tr><td>v0</td><td>❌</td><td>✅ Bileşenler</td><td>❌</td><td>❌</td></tr>
  </tbody>
</table>

<h2>Hangisini Kullanmalısınız?</h2>

<ul>
  <li><strong>Backend geliştiricisiniz</strong> ve yeni bir API servisi için iskelet gerekiyor → PromptForge</li>
  <li><strong>Teknik olmayan bir kurucusunuz</strong> ve kod yazmadan MVP yayınlamak istiyorsunuz → Lovable</li>
  <li><strong>Hızlıca bir React bileşenine</strong> ihtiyacınız var → v0</li>
  <li><strong>Tarayıcıda görsel olarak prototip</strong> yapmak ve yinelemek istiyorsunuz → Bolt.new</li>
</ul>

<p>Araçlar farklı kitlelere hizmet ediyor. Kodu kendileri deploy edecek, bakımını yapacak ve genişletecek geliştiriciler için PromptForge, profesyonel bir geliştirme iş akışına doğal biçimde uyan çıktı üretir. Diğerleri için Lovable ve Bolt.new, kontrol pahasına daha fazla rehberlik sunar.</p>
    `,
  },

  {
    slug: "rest-api-authentication-nestjs-jwt",
    title: "NestJS ve JWT ile REST API Kimlik Doğrulama: Eksiksiz Kurulum",
    description:
      "NestJS'te JWT kimlik doğrulamanın üretime hazır uygulamasına yönelik kılavuz — access token'lar, refresh token'lar, guard'lar ve kaçınılması gereken yaygın hatalar.",
    date: "2026-01-28",
    readTime: 9,
    category: "Mühendislik",
    content: `
<p>JWT kimlik doğrulama, basit görünen ama yanlış gitmenin düzinelerce yolu olan konulardan biridir. Birçok NestJS servisinde uyguladıktan — ve PromptForge gibi AI üreticilerinin ne ürettiğini gördükten — sonra, üretimde güvenilir biçimde çalışan kalıbı paylaşıyorum.</p>

<h2>Temel Mimari</h2>

<p>Üretime hazır bir JWT kurulumu, tek değil iki token gerektirir:</p>

<ul>
  <li><strong>Access token</strong>: Kısa ömürlü (15 dakika ila 1 saat). Her API isteğiyle gönderilir. Durumsuz — doğrulamak için veritabanı araması gerekmez.</li>
  <li><strong>Refresh token</strong>: Uzun ömürlü (7–30 gün). Yalnızca yeni bir access token almak için kullanılır. Güvenli şekilde saklanmalıdır (httpOnly cookie veya güvenli depolama).</li>
</ul>

<p>Çoğu eğitim access token'da durur. Öğrenmek için bu yeterlidir; ancak üretimde kullanıcılar her saat oturumdan çıkar ve sessizce yeniden kimlik doğrulama yolu yoktur.</p>

<h2>NestJS'te Passport ve JWT Kurulumu</h2>

<pre><code>// auth.module.ts
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}</code></pre>

<h2>JWT Strategy</h2>

<pre><code>// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; type: string }) {
    if (payload.type !== 'access') throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}</code></pre>

<p><code>type</code> claim kontrolüne dikkat edin. Bu, refresh token'ın access token olarak kullanılmasını engeller — token'ları birbirinden ayırt etmezseniz ortaya çıkan ince ama gerçek bir güvenlik sorunudur.</p>

<h2>Token Üretmek</h2>

<pre><code>private generateAccessToken(userId: string, email: string): string {
  return this.jwtService.sign(
    { sub: userId, email, type: 'access' },
    { expiresIn: '1h' }
  );
}

private generateRefreshToken(userId: string, email: string): string {
  return this.jwtService.sign(
    { sub: userId, email, type: 'refresh' },
    { expiresIn: '30d' }
  );
}</code></pre>

<h2>Refresh Endpoint</h2>

<pre><code>@Post('refresh')
async refresh(@Body() body: { refreshToken: string }) {
  const payload = this.jwtService.verify(body.refreshToken, {
    secret: this.config.get('JWT_SECRET'),
  });

  if (payload.type !== 'refresh') {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const user = await this.usersService.findById(payload.sub);
  if (!user?.isActive) throw new UnauthorizedException();

  return { token: this.generateAccessToken(user.id, user.email) };
}</code></pre>

<h2>Yaygın Hatalar</h2>

<p><strong>1. Access ve refresh token'lar için aynı secret kullanmak.</strong> Birçok uygulama için sorun değil; ancak refresh token'ları bağımsız olarak iptal etmek istiyorsanız ayrı secret'lar kullanın.</p>

<p><strong>2. Refresh endpoint'inde <code>isActive</code> kontrolü yapmamak.</strong> Bir kullanıcı yasaklandığında ama geçerli refresh token'ı varsa, her yenilemede durumunu kontrol etmezseniz yeni access token üretmeye devam eder.</p>

<p><strong>3. Refresh token'ları localStorage'da saklamak.</strong> XSS'e karşı savunmasız. Refresh token için httpOnly cookie, access token için ise bellek (veya en az sessionStorage) kullanın.</p>

<p><strong>4. İstemci tarafında token süresini yönetmemek.</strong> 401 yanıtlarını yakalayın, refresh endpoint'ini çağırın ve orijinal isteği yeniden deneyin. Bunu yapmazsanız access token süresi dolduğunda kullanıcılar sessizce oturumdan çıkar.</p>

<h2>Üretilen ve Elle Yazılan Kod</h2>

<p>PromptForge bu tam kimlik doğrulama kurulumunu otomatik olarak üretir — refresh token akışı, JWT guard, strategy ve istemci tarafı interceptor dahil. Çoğu uygulama için üretilen kod bu durumları doğru şekilde kutunun dışında ele alır. Yalnızca gereksinimleriniz standart kalıptan ayrıldığında özelleştirmeniz gerekir.</p>
    `,
  },
  // ─── Post 6 ───────────────────────────────────────────────────────────────────
  {
    slug: "nestjs-vs-express-2026",
    title: "NestJS ve Express: 2026'da Hangi Backend Framework'ü Kullanmalı",
    description:
      "Üretim API'leri oluşturmak için NestJS ve Express.js'nin pratik karşılaştırması. Mimari, ölçeklenebilirlik, TypeScript desteği ve her birini ne zaman kullanacağınızı ele alıyoruz.",
    date: "2026-03-18",
    readTime: 8,
    category: "Karşılaştırma",
    content: `
<p>Sonraki projeniz için bir backend framework mi seçiyorsunuz? NestJS ve Express, en popüler iki Node.js seçeneğidir — ancak çok farklı ihtiyaçlara hizmet ederler. Bu rehber pazarlamayı bir kenara bırakır ve her birini tam olarak ne zaman kullanmanız gerektiğini anlatır.</p>

<h2>Kısa Yanıt</h2>

<p><strong>NestJS kullanın</strong>: Ölçeklendirilmesi gereken karmaşık bir uygulama oluşturuyorsanız — bir SaaS ürünü, kurumsal bir API veya aynı kod tabanında birden fazla ekibin çalıştığı herhangi bir şey.</p>

<p><strong>Express kullanın</strong>: Hızlıca hafif ve bağımsız bir sunucuya ihtiyacınız varsa — bir webhook işleyicisi, basit bir REST API veya atacağınız bir prototip.</p>

<h2>Mimari</h2>

<p>Express minimal bir HTTP kütüphanesidir. Size yönlendirme ve middleware sağlar, başka bir şey vermez. Her mimari karar — klasör yapısı, bağımlılık enjeksiyonu, doğrulama, yapılandırma — size aittir. Bu, basit uygulamalar için güçlüdür; ancak ölçekte bir yük haline gelir. Bir şirketteki on farklı Express projesi, on farklı yapıya sahip olacaktır.</p>

<p>NestJS, Express (veya Fastify) üzerine inşa edilmiş görüşlü bir framework'tür. Angular'ın mimarisinden büyük ölçüde etkilenmiştir: modüller, service'ler, controller'lar, dekoratörler ve bağımlılık enjeksiyonu birinci sınıf vatandaşlardır. Mimari kararlar vermek için daha az zaman harcar, özellik geliştirmeye daha fazla odaklanırsınız.</p>

<h2>TypeScript Desteği</h2>

<p>Express teknik olarak TypeScript ile çalışır; ancak JavaScript için tasarlanmıştır. Tip tanımlamaları eklemeye, tsconfig yapılandırmaya ve topluluk tarafından tutulan tipler bulmaya (<code>@types/express</code>) zaman harcarsınız.</p>

<p>NestJS en başından TypeScript ile yazılmıştır. Dekoratörler, metadata yansıması ve tip çıkarımı framework'e yerleşiktir. Sonuç, Express'in bir türlü sunamayacağı çok daha iyi bir IDE deneyimidir — otomatik tamamlama, yeniden düzenleme ve derleme zamanı hata yakalama.</p>

<h2>Boilerplate</h2>

<p>Bu konuda Express kazanır. Express'te çalışan bir HTTP sunucusu:</p>

<pre><code>const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ ok: true }));
app.listen(3000);</code></pre>

<p>NestJS bir modül, controller ve main.ts gerektirir — daha fazla dosya; ancak her birinin net bir sorumluluğu var. Büyük projeler için bu yapı karşılığını verir. 200 satırlık bir API için ise fazladan yük oluşturur.</p>

<h2>Ekosistem ve Entegrasyonlar</h2>

<p>NestJS'in modern uygulamaların ihtiyaç duyduğu hemen her şey için birinci parti paketleri vardır: <code>@nestjs/jwt</code>, <code>@nestjs/passport</code>, <code>@nestjs/config</code>, <code>@nestjs/typeorm</code>, <code>@nestjs/prisma</code> ve daha fazlası. Her biri aynı modül kalıbını izler; bu yüzden entegrasyonlar zorla eklenmiş değil, doğal hissettirer.</p>

<p>Express, daha geniş npm ekosistemine dayanır. Her şey için paket bulursunuz; ancak bunları tutarlı biçimde birleştirmek sizin sorumluluğunuzdur.</p>

<h2>Performans</h2>

<p>Ham Express, NestJS'ten biraz daha hızlıdır; çünkü NestJS bir soyutlama katmanı ekler. Pratikte fark ihmal edilebilir düzeydedir — her ikisi de ticari donanımda saniyede binlerce isteği işleyebilir. Veritabanı sorgularınız ve harici API çağrılarınız, framework'ten çok önce uygulamanızda darboğaz oluşturacaktır.</p>

<p>Ham verim her şeyden önemliyse, altta yatan adaptör olarak Fastify ile NestJS kullanın — framework'ün yapısını neredeyse yerel performansla elde edersiniz.</p>

<h2>Öğrenme Eğrisi</h2>

<p>Express, başlangıç dostu. Kavramlar (route'lar, middleware, istek/yanıt) doğrudan HTTP ile örtüşüyor. Çoğu geliştirici bir gün içinde Express'te üretken olur.</p>

<p>NestJS daha dik bir eğriye sahiptir. Bağımlılık enjeksiyonu, dekoratörler ve modül sistemleri güçlüdür; ancak sade JavaScript'ten gelen geliştiricilere yabancıdır. Hızınız artmadan önce kalıpları içselleştirmek için birkaç gün ayırın.</p>

<h2>NestJS Ne Zaman Kullanılır</h2>

<ul>
<li>Bir SaaS ürünü veya çok modüllü API inşa etmek</li>
<li>İkiden fazla geliştiriciden oluşan bir ekipte çalışmak</li>
<li>TypeScript'i birinci sınıf vatandaş olarak istiyorsanız</li>
<li>Yerleşik doğrulama, guard'lar, interceptor'lar veya pipe'lara ihtiyacınız varsa</li>
<li>Kod üretiyorsunuz — PromptForge gibi AI araçları NestJS üretir; çünkü yapı tahmin edilebilir ve makine tarafından okunabilir</li>
</ul>

<h2>Express Ne Zaman Kullanılır</h2>

<ul>
<li>Prototip yapıyorsunuz veya atacağınız bir MVP oluşturuyorsunuz</li>
<li>Küçük, tek amaçlı bir API (webhook alıcısı, dosya yükleyici)</li>
<li>Eski bir JavaScript projesini kademeli olarak taşımak</li>
<li>Express'i zaten iyi biliyorsunuz ve proje kapsamı küçük</li>
</ul>

<h2>Sonuç</h2>

<p>Büyümesini beklediğiniz herhangi bir proje için NestJS, 2026'da daha iyi varsayılandır. İlk boilerplate maliyeti önceden ödenir; ancak uygulamanız ölçeklendikçe hızla geri döner. Express, yapının önüne geçtiği küçük, odaklı servisler için mükemmel olmaya devam eder.</p>

<p>PromptForge, tek bir doğal dil promptundan modüller, service'ler, controller'lar, Prisma entegrasyonu, JWT kimlik doğrulama ve Docker yapılandırması dahil üretime hazır NestJS projeleri üretir. Kurulumu tamamen atlamak istiyorsanız <a href="/register">ücretsiz deneyin</a>.</p>
    `,
  },

  // ─── Post 7 ───────────────────────────────────────────────────────────────────
  {
    slug: "deploy-nestjs-to-railway",
    title: "NestJS Uygulamasını 10 Dakikada Railway'e Nasıl Deploy Edilir",
    description:
      "Railway'e NestJS + PostgreSQL uygulaması deploy etmek için adım adım kılavuz: ortam değişkenleri, Dockerfile kurulumu ve özel domain'ler dahil.",
    date: "2026-03-20",
    readTime: 7,
    category: "Eğitim",
    content: `
<p>Railway, backend uygulamaları deploy etmek için en iyi platformlardan biri haline geldi. Hızlıdır, ücretsiz katmanı cömerttir ve PostgreSQL yerleşik olarak gelir. Bu kılavuz, yaklaşık on dakika içinde bir NestJS uygulamasını sıfırdan üretime almanın yolunu gösteriyor.</p>

<h2>Ön Koşullar</h2>

<ul>
<li>GitHub deposunda bir NestJS uygulaması</li>
<li>Railway hesabı (ücretsiz katman yeterli)</li>
<li>Veritabanı olarak PostgreSQL (Railway sağlar)</li>
</ul>

<h2>Adım 1: Dockerfile Ekleyin</h2>

<p>Railway Node.js projelerini otomatik olarak algılayabilir; ancak Dockerfile derleme üzerinde tam kontrol sağlar. NestJS için üretim için optimize edilmiş bir Dockerfile:</p>

<pre><code>FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/main"]</code></pre>

<p>Bu çok aşamalı derleme kullanır — ilk aşama TypeScript'i derler, ikinci aşama yalnızca derlenmiş çıktıyı ve üretim bağımlılıklarını kopyalar. Son görüntü yalın ve hızlı başlar.</p>

<h2>Adım 2: Uygulamanızı PORT'u Dinleyecek Şekilde Yapılandırın</h2>

<p>Railway, <code>PORT</code> ortam değişkeni aracılığıyla dinamik bir port atar. NestJS <code>main.ts</code>'inizin bunu okuması gerekir:</p>

<pre><code>async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(\`Application running on port \${port}\`);
}
bootstrap();</code></pre>

<h2>Adım 3: Railway Projesi Oluşturun</h2>

<ol>
<li><strong>railway.app</strong>'e gidin ve GitHub ile giriş yapın</li>
<li><strong>New Project</strong> → <strong>Deploy from GitHub repo</strong>'ya tıklayın</li>
<li>Deponuzu seçin</li>
<li>Railway Dockerfile'ı algılayacak ve derlemeye başlayacaktır</li>
</ol>

<h2>Adım 4: PostgreSQL Ekleyin</h2>

<ol>
<li>Railway projenizde <strong>New</strong> → <strong>Database</strong> → <strong>PostgreSQL</strong>'e tıklayın</li>
<li>Railway veritabanı oluşturur ve otomatik olarak <code>DATABASE_URL</code> sağlar</li>
<li>NestJS servisinizde buna başvurun: <code>process.env.DATABASE_URL</code></li>
</ol>

<p>Prisma kullanıyorsanız, istemciyi otomatik oluşturmak için <code>postinstall</code> betiği ekleyin:</p>

<pre><code>// package.json
"scripts": {
  "postinstall": "prisma generate",
  "build": "nest build"
}</code></pre>

<h2>Adım 5: Ortam Değişkenlerini Ayarlayın</h2>

<p>Railway'in kontrol panelinde servisinize → <strong>Variables</strong>'a gidin ve şunları ekleyin:</p>

<pre><code>NODE_ENV=production
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app</code></pre>

<p>Railway, <code>DATABASE_URL</code>'yi PostgreSQL servisinden otomatik olarak enjekte eder — manuel olarak ayarlamanıza gerek yoktur.</p>

<h2>Adım 6: Prisma Migration'larını Çalıştırın</h2>

<p>En güvenli yaklaşım, sunucu başlamadan önce migration'ları çalıştırmaktır. Bunu Dockerfile CMD'nize veya bir başlatma betiğine ekleyin:</p>

<pre><code>CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]</code></pre>

<p>Ya da servis ayarlarındaki Railway'in <strong>Start Command</strong> geçersiz kılma özelliğini kullanın.</p>

<h2>Adım 7: Özel Domain</h2>

<ol>
<li>Railway'de servisinize → <strong>Settings</strong> → <strong>Networking</strong> → <strong>Custom Domain</strong>'e gidin</li>
<li>Domain'inizi girin (ör. <code>api.yourdomain.com</code>)</li>
<li>DNS sağlayıcınızda Railway'in verdiği host adına işaret eden bir CNAME kaydı ekleyin</li>
<li>Railway SSL sertifikasını otomatik olarak sağlar</li>
</ol>

<h2>Deployment'ınızı İzleme</h2>

<p>Railway, <strong>Deployments</strong> sekmesinde gerçek zamanlı loglar gösterir. Derlemeniz başarısız olursa loglar tam olarak nedenini söyleyecektir. Yaygın sorunlar:</p>

<ul>
<li><strong>PORT ayarlanmamış</strong>: Uygulamanızın <code>process.env.PORT</code>'u okuduğundan emin olun</li>
<li><strong>Prisma client oluşturulmamış</strong>: Derleme adımınıza <code>prisma generate</code> ekleyin</li>
<li><strong>Eksik ortam değişkenleri</strong>: Variables sekmesinde yazım hatalarını kontrol edin</li>
</ul>

<h2>PromptForge ile Otomatikleştirin</h2>

<p>PromptForge tarafından oluşturulan her proje, üretime hazır bir Dockerfile, bir <code>railway.json</code> yapılandırması ve Railway'in PostgreSQL'iyle uyumlu bir Prisma kurulumu içerir. Prompttan deploy edilmiş API'ye 15 dakikanın altında geçebilirsiniz — manuel yapılandırma gerekmez. <a href="/register">Ücretsiz deneyin</a>.</p>
    `,
  },

  // ─── Post 8 ───────────────────────────────────────────────────────────────────
  {
    slug: "what-is-ai-code-generation",
    title: "AI Kod Üretimi Nedir? 2026 İçin Geliştirici Kılavuzu",
    description:
      "AI kod üretimi, geliştiricilerin yazılım geliştirme biçimini dönüştürüyor. Bu kılavuz nasıl çalıştığını, neyde iyi olduğunu, gerçek sınırlamalarını ve ondan en iyi şekilde nasıl yararlanacağınızı açıklıyor.",
    date: "2026-03-22",
    readTime: 9,
    category: "Mühendislik",
    content: `
<p>AI kod üretimi artık bir yenilik değil — modern geliştiricilerin çalışma biçiminin temel bir parçası. Ancak "GitHub Copilot bir satırı otomatik tamamlar" ile "bir AI uygulamanın tamamını oluşturur" arasında geniş bir yelpaze var. Araçların bu yelpazede nerede durduğunu anlamak, doğru olanı seçmenize yardımcı olur.</p>

<h2>AI Kod Üretimi Nasıl Çalışır</h2>

<p>Modern kod üretim araçları, açık kaynak depolardan, belgelerden ve programlama eğitimlerinden milyarlarca satır kod üzerinde eğitilmiş büyük dil modelleri (LLM'ler) üzerine inşa edilmiştir. Bu modeller, koddaki istatistiksel kalıpları öğrenir — hangi fonksiyonların birlikte görünme eğiliminde olduğunu, veri yapılarının nasıl şekillendirildiğini, hangi API'lerin hangi kütüphanelerle yaygın kullanıldığını.</p>

<p>Bir modele doğal dil prompt'u verdiğinizde, olası sonraki token'lar (kabaca: karakterler veya sözcük parçaları) üzerinde bir olasılık dağılımı üretir ve çıktı oluşturmak için bu dağılımdan örnekler alır. Çıktıdaki "zeka", eğitim sırasında makul tamamlamalar üretebilecek kadar benzer kalıp görmüş olmaktan kaynaklanır.</p>

<h2>Üç Kod Üretim Kategorisi</h2>

<p><strong>Satır ve fonksiyon tamamlama</strong> (GitHub Copilot, Cursor tab, IDE uzantıları): AI yazdıklarınızı izler ve sonraki birkaç satırı önerir. Hızlı, düşük çabalı ve halihazırda çoğu editörde standart. Halihazırda yazdığınız bir dosyada tekrarlayan yazmayı azaltmak için en iyisi.</p>

<p><strong>Konuşma tabanlı kodlama</strong> (Claude, ChatGPT, Gemini): Bir sohbet arayüzünde ne istediğinizi anlatırsınız, model yanıt olarak kodu yazar veya yeniden yazar. Uygulamalar oluşturmak, mevcut kodu açıklamak, hata ayıklamak ve test yazmak için iyidir. Doğru çıktıyı almak için ileri geri gerektirir.</p>

<p><strong>İskelet oluşturma ve proje üretimi</strong> (PromptForge, v0, Lovable): AI, üst düzey bir açıklamadan eksiksiz bir proje yapısı üretir — dosyalar, modüller, yapılandırma ve bağımlılıklar hepsi bir anda. Günler harcamadan yeni projelere başlamak için en iyisi.</p>

<h2>AI Kod Üretiminin İyi Olduğu Şeyler</h2>

<ul>
<li><strong>Boilerplate</strong>: CRUD endpoint'leri, kimlik doğrulama modülleri, DTO sınıfları ve yapılandırma dosyaları son derece yapılandırılmış ve dolayısıyla tahmin edilebilirdir. AI bunları güvenilir biçimde üretir.</li>
<li><strong>Standart kalıplar</strong>: RESTful API'ler, veritabanı şemaları, JWT kimlik doğrulama, Docker dosyaları — eğitim verisinde milyonlarca kez görünen köklü kalıplar.</li>
<li><strong>Tekrarlayan görevler</strong>: Mevcut fonksiyonlar için test yazma, veri formatlarını dönüştürme, dokümantasyon oluşturma.</li>
<li><strong>Tanıdık olmayan API'ler</strong>: Daha önce kullanmadığınız bir kütüphane için başlangıç kodu üretme; kütüphanenin belgelenmiş kalıplarını rehber olarak kullanma.</li>
</ul>

<h2>AI Kod Üretiminin Zorlandığı Şeyler</h2>

<ul>
<li><strong>Yeni algoritmalar</strong>: Probleminiz bilinen çözümlere benzemeyen yeni bir yaklaşım gerektiriyorsa model, makul görünümlü ama hatalı kod üretebilir.</li>
<li><strong>Derin özel iş mantığı</strong>: Spesifik etki alanınızın, fiyatlandırma kurallarınızın veya yasal gereksinimlerinizin nüansları eğitim verisinde yoktur.</li>
<li><strong>Büyük ölçekli tutarlılık</strong>: Oluşturulan kod birkaç yüz satırın ötesine geçtikçe dahili tutarlılığı korumak — adlandırma, soyutlama düzeyleri, hata yönetimi — model için zorlaşır.</li>
<li><strong>Güvenlik hassas kod</strong>: Oluşturulan kod ince güvenlik açıkları içerebilir. Kimlik doğrulama, girdi doğrulama ve şifreleme kodlarını her zaman dikkatlice gözden geçirin.</li>
</ul>

<h2>Doğru Zihinsel Model</h2>

<p>AI kod üretimini çok hızlı, çok iyi okumuş bir junior geliştirici olarak düşünün. Standart kalıpları hızlı ve güvenilir biçimde uygulayabilir. Güvenlik hassas veya etki alanına özgü her şey için gözden geçirmenize ihtiyaç duyar. Net ve ayrıntılı bir kısa brifing verdiğinizde en iyi şekilde çalışır — belirsiz prompt'lar belirsiz kod üretir.</p>

<h2>Kod Üretiminden En İyi Şekilde Yararlanmak</h2>

<p><strong>Spesifik olun.</strong> "Görev yönetimi API'si oluştur" genel çıktı üretir. "Kullanıcılar, projeler, öncelik ve bitiş tarihi olan görevler ve takım atamalarıyla bir görev yönetimi API'si oluştur. NestJS, Prisma ve PostgreSQL kullan" anında kullanışlı bir şey üretir.</p>

<p><strong>Yineleyin.</strong> İlk çıktıyı taslak olarak değerlendirin. Sohbet tabanlı araçlar ve PromptForge gibi özelleşmiş üreticiler, sonraki prompt'larda çıktıyı iyileştirmenize olanak tanır.</p>

<p><strong>Çıktıyı gözden geçirin.</strong> Çalıştırmadan önce oluşturulan kodu okuyun. LLM'ler zaman zaman yöntem adlarını hayal eder, edge case'leri kaçırır veya kütüphane API'leri hakkında yanlış varsayımlar yapar. Beş dakikalık gözden geçirme, saatlerce hata ayıklamayı önler.</p>

<p><strong>Özelleşmiş görevler için özelleşmiş araçlar kullanın.</strong> Tek seferlik betikler için genel amaçlı bir sohbet modeli yeterlidir. Doğru bir Prisma şeması, ilişkileri ve üretim yapılandırmasıyla eksiksiz bir NestJS projesi üretmek için PromptForge gibi özelleşmiş bir araç, söz konusu göreve özel optimize edildiğinden çok daha iyi çıktı üretir.</p>

<h2>Gidiş Yönü</h2>

<p>Kod üretim doğruluğu her model nesliyle hızla iyileşiyor. Yön, yalnızca kod yazmak değil, kod üretebilen, test edebilen, hata ayıklayabilen ve otonom olarak deploy edebilen agent'lara doğru. En çok faydalanacak geliştiriciler, bu araçları geliştirmenin yerine geçen araçlar olarak değil, çarpan olarak kullanmayı öğrenenler olacak.</p>

<p>PromptForge, yelpazanin iskelet oluşturma ucunda yer alır — kurulumu atlayıp ürününüzü benzersiz kılan şeye odaklanabilmeniz için doğal dilden eksiksiz üretime hazır NestJS uygulamaları üretir. <a href="/register">Ücretsiz başlayın.</a></p>
    `,
  },

  // ─── Post 9 ───────────────────────────────────────────────────────────────────
  {
    slug: "nestjs-prisma-postgresql-tutorial",
    title: "NestJS, Prisma ve PostgreSQL ile REST API Oluşturma",
    description:
      "NestJS, Prisma ORM ve PostgreSQL kullanarak üretime hazır REST API oluşturmak için eksiksiz eğitim — şema tasarımından endpoint'leri çalıştırmaya kadar.",
    date: "2026-03-24",
    readTime: 11,
    category: "Eğitim",
    content: `
<p>Prisma ve PostgreSQL ile NestJS, 2026'da mevcut en üretken backend stack'lerinden biridir. NestJS yapı ve bağımlılık enjeksiyonu sağlar, Prisma tip güvenliğiyle veritabanı erişimini yönetir ve PostgreSQL savaşta test edilmiş ilişkisel bir veritabanı sunar. İşte bu stack ile eksiksiz bir REST API nasıl oluşturulur.</p>

<h2>Proje Kurulumu</h2>

<p>Yeni bir NestJS projesi oluşturun ve Prisma'yı yükleyin:</p>

<pre><code>npm i -g @nestjs/cli
nest new my-api
cd my-api
npm install prisma @prisma/client
npx prisma init</code></pre>

<p>Bu işlem bir <code>prisma/schema.prisma</code> dosyası ve yer tutucu <code>DATABASE_URL</code> içeren bir <code>.env</code> oluşturur.</p>

<h2>Veritabanı Bağlantısını Yapılandırın</h2>

<p><code>.env</code>'yi PostgreSQL bağlantı dizinizle güncelleyin:</p>

<pre><code>DATABASE_URL="postgresql://postgres:password@localhost:5432/myapi_db"</code></pre>

<p>PostgreSQL kurulu değilse en hızlı yol Docker'dır:</p>

<pre><code>docker run --name my-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=myapi_db -p 5432:5432 -d postgres:16</code></pre>

<h2>Şemanızı Tanımlayın</h2>

<p><code>prisma/schema.prisma</code>'yı açın ve modellerinizi tanımlayın. Basit bir görev yönetimi API'si oluşturalım:</p>

<pre><code>generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  priority    Priority   @default(MEDIUM)
  status      TaskStatus @default(TODO)
  dueDate     DateTime?
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}</code></pre>

<p>Tabloları oluşturmak için migration'ı çalıştırın:</p>

<pre><code>npx prisma migrate dev --name init</code></pre>

<h2>Prisma Service Oluşturun</h2>

<p>Uygulamanızın geri kalanının enjekte ettiği paylaşımlı bir Prisma servisi oluşturun:</p>

<pre><code>// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}</code></pre>

<pre><code>// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}</code></pre>

<h2>Tasks Modülünü Oluşturun</h2>

<pre><code>// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...dto, userId },
    });
  }

  async update(id: string, userId: string, dto: Partial&lt;CreateTaskDto&gt;) {
    await this.findOne(id, userId); // bulunamazsa hata fırlatır
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.delete({ where: { id } });
  }
}</code></pre>

<h2>DTO'larla Doğrulama</h2>

<p>Doğrulama paketlerini yükleyin ve class-validator dekoratörlerini kullanın:</p>

<pre><code>npm install class-validator class-transformer</code></pre>

<pre><code>// src/tasks/dto/create-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Priority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}</code></pre>

<p><code>main.ts</code>'te doğrulamayı global olarak etkinleştirin:</p>

<pre><code>app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));</code></pre>

<h2>Endpoint'lerinizi Test Edin</h2>

<p>Çalıştıktan sonra (<code>npm run start:dev</code>) API'niz <code>http://localhost:3000</code> adresinde kullanılabilir:</p>

<pre><code>POST /tasks          → Görev oluştur
GET  /tasks          → Tüm görevleri listele
GET  /tasks/:id      → Bir görevi getir
PATCH /tasks/:id     → Görevi güncelle
DELETE /tasks/:id    → Görevi sil</code></pre>

<h2>PromptForge ile Kurulumu Atlayın</h2>

<p>Bu eğitim, NestJS + Prisma + PostgreSQL kurulumunun temellerini ele aldı. Üretime hazır bir uygulama ayrıca kimlik doğrulama, hız sınırlama, hata yönetimi, Swagger dokümantasyonu, Docker yapılandırması ve CI/CD gerektirir. Bunların tümünü sıfırdan kurmak 1–2 gün sürer.</p>

<p>PromptForge tümünü üretir — şema, service'ler, controller'lar, kimlik doğrulama modülü, Dockerfile ve dokümantasyon — tek bir prompttan beş dakika içinde. <a href="/register">Ücretsiz deneyin.</a></p>
    `,
  },

  // ─── Post 10 ───────────────────────────────────────────────────────────────────
  {
    slug: "saas-mvp-launch-checklist",
    title: "SaaS MVP Lansman Kontrol Listesi: Yayına Almadan Önce Yapılacak 20 Şey",
    description:
      "SaaS MVP'nizi yayına almadan önce bu 20 temel maddeyi tamamladığınızdan emin olun — kimlik doğrulama ve ödemelerden hata izleme, hukuki sayfalar ve SEO temellerine kadar.",
    date: "2026-03-26",
    readTime: 10,
    category: "Mühendislik",
    content: `
<p>Çoğu geliştirici aylarca özellik geliştirip ardından lansmanı aceleye getirerek önemli adımları atlar. Bu kontrol listesi, SaaS ürününüzden bahsetmeden önce hazır bulundurmanız gereken 20 şeyi kapsar.</p>

<h2>Kimlik Doğrulama ve Erişim</h2>

<p><strong>1. Düzgün karma ile e-posta + şifre kimlik doğrulama.</strong> Şifreler bcrypt (maliyet faktörü ≥ 12) veya Argon2 ile karma yapılmalıdır. Asla düz metin saklamayın. Şifreler için asla MD5 veya SHA-1 kullanmayın.</p>

<p><strong>2. E-posta doğrulama.</strong> Kullanıcıların ücretli özelliklere erişmeden önce e-postalarını doğrulamalarını zorunlu kılın. Bu, sahtekarlığı azaltır, e-posta gönderdiğinizde iletim oranını iyileştirir ve onaylı bir iletişim kanalı sağlar.</p>

<p><strong>3. Şifre sıfırlama akışı.</strong> Uçtan uca test edin. Sıfırlama bağlantısı 1 saat içinde sona ermeli. Sıfırlama sonrasında mevcut tüm oturumlar geçersiz kılınmalı.</p>

<p><strong>4. Kimlik doğrulama endpoint'lerinde hız sınırlama.</strong> Hız sınırlaması olmadan giriş ve kayıt endpoint'leriniz kimlik bilgisi doldurma ve brute force saldırılarının hedefi olur. Kimlik doğrulama rotalarında en az IP başına 5 istek/dakika uygulayın.</p>

<h2>Ödemeler</h2>

<p><strong>5. Üretimde çalışan ödeme akışı.</strong> Sandbox değil — gerçek üretim. Gerçek kartla test edin. Webhook'un tetiklendiğini ve veritabanınızın güncellendiğini doğrulayın. Bu, lansman günü bozulan tek en yaygın şeydir.</p>

<p><strong>6. Abonelik yönetimi.</strong> Kullanıcıların size e-posta göndermeden yükseltme, düşürme ve iptal yapabilmesi gerekir. Otomatikleştirin.</p>

<p><strong>7. Fatura makbuzu e-postaları.</strong> Çoğu hukuki sistemde yasal gereklilik. Çoğu ödeme işlemcisi (Stripe, iyzico) bunları otomatik olarak gönderir — yapılandırıldığından emin olun.</p>

<h2>Hata Yönetimi ve İzleme</h2>

<p><strong>8. Hata izleme.</strong> Sentry (ücretsiz katman) veya Highlight.io, işlenmemiş istisnaları yakalar ve size uyarı gönderir. Bu olmadan, çökmeleri kullanıcılar size e-posta gönderdiğinde öğrenirsiniz — ya da göndermediklerinde.</p>

<p><strong>9. Backend'de yapılandırılmış loglama.</strong> <code>console.log</code> yerine logger (Pino, Winston) kullanın. Üretimde loglar aranabilir olmalıdır. Railway ve Vercel'in her ikisi de yapılandırılmış logları kontrol panellerinde gösterir.</p>

<p><strong>10. Zarif hata sayfaları.</strong> "Internal Server Error" yazan bir 500 sayfası bitmemiş görünür. Kullanıcıların geri gitmesine yardımcı olan bir 404 profesyonel görünür. Her ikisi de 20 dakikaya değer.</p>

<h2>Güvenlik</h2>

<p><strong>11. Her yerde HTTPS.</strong> API callback'leri ve webhook'lar dahil her endpoint. Çoğu hosting platformu (Railway, Vercel) bunu otomatik olarak yönetir — etkinleştirildiğini doğrulayın.</p>

<p><strong>12. CORS doğru şekilde yapılandırılmış.</strong> API'niz üretimde yalnızca frontend domain'inizden gelen istekleri kabul etmelidir. Joker karakter <code>*</code> CORS politikası bir güvenlik riskidir.</p>

<p><strong>13. Ortam değişkenlerindeki gizli anahtarlar.</strong> Kodunuzda veya git geçmişinizde API anahtarı, JWT secret'ı veya veritabanı parolası olmamalı. Emin değilseniz <code>git log -p</code> ile denetleyin.</p>

<p><strong>14. Girdi doğrulama.</strong> API sınırında tüm kullanıcı girdilerini doğrulayın ve sanitize edin. NestJS'te class-validator, sade bir Express uygulamasında Zod kullanın. İstemciden gelen verilere asla güvenmeyin.</p>

<h2>Hukuki ve Güven</h2>

<p><strong>15. Gizlilik Politikası.</strong> AB kullanıcılarınız varsa GDPR gereği zorunludur (ve olacaktır). Hangi verileri topladığınızı, nasıl kullandığınızı ve kullanıcıların silme talebini nasıl yapabileceğini açıklamalıdır.</p>

<p><strong>16. Kullanım Koşulları.</strong> Sizi hukuki olarak korur. En azından kabul edilebilir kullanım, abonelik koşulları, sorumluluk sınırlaması ve yürürlükteki hukuku kapsayın.</p>

<p><strong>17. Çerez onayı (gerekirse).</strong> Analitik çerezler veya izleme kullanıyorsanız AB mevzuatı rızayı zorunlu kılar. Yalnızca zorunlu/oturum çerezleri kullanıyorsanız gizlilik politikanızda basit bir bildirim yeterlidir.</p>

<h2>SEO ve Pazarlama Temelleri</h2>

<p><strong>18. Google Search Console'a gönderilmiş <code>sitemap.xml</code>.</strong> Bu olmadan Google sayfalarınızı yine bulabilir; ancak daha uzun sürer. Manuel olarak gönderin ve 48 saat sonra kapsam raporunu kontrol edin.</p>

<p><strong>19. Open Graph meta etiketleri.</strong> Biri Twitter, LinkedIn veya Slack'te linkinizi paylaştığında, önizleme ürün adınızı, açıklamanızı ve iyi görünen bir görseli göstermelidir. OG etiketleri olmadan önizleme düz metindir.</p>

<p><strong>20. Domain'iniz için gerçek bir e-posta adresi.</strong> Bir Gmail değil, <code>hello@urunüm.com</code> veya <code>destek@urunüm.com</code>. Domain doğrulamalı e-posta, iletim oranını iyileştirir ve profesyonel görünür. SPF, DKIM ve DMARC kayıtlarını ayarlayın.</p>

<h2>Boilerplate'i Otomatikleştirin</h2>

<p>1–4. maddeler (kimlik doğrulama), 8–14. maddeler (hata yönetimi ve güvenlik) ve deployment yapılandırması otomatik olarak üretilebilir. PromptForge, kimlik doğrulama, hız sınırlama, girdi doğrulama, Dockerfile ve CI/CD yapılandırması yerleşik NestJS uygulamaları üretir — böylece tek satır iş mantığı yazmadan önce bu listeden 14 maddeyi işaretleyebilirsiniz.</p>

<p><a href="/register">Backend'inizi ücretsiz oluşturun</a> ve bu listedeki 14 maddeyi tek satır iş mantığı yazmadan önce tamamlayın.</p>
    `,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
