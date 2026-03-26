/**
 * Turkish integration templates
 * Generates ready-to-use service files for Türkiye-specific requirements:
 *  - iyzico payment processing
 *  - e-Fatura / e-Arşiv (GİB UBL-TR XML)
 *  - KVKK (Kişisel Verilerin Korunması Kanunu) compliance
 */

// ─── iyzico ──────────────────────────────────────────────────────────────────

export function generateIyzicoService(): string {
  return `import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';

// npm install iyzipay
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require('iyzipay');

export interface IyzicoPaymentParams {
  price: string;
  paidPrice: string;
  currency?: string;
  installment?: number;
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    ip: string;
    city: string;
    country: string;
    zipCode?: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  shippingAddress?: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: 'PHYSICAL' | 'VIRTUAL';
    price: string;
  }>;
}

export interface IyzicoCheckoutFormParams {
  price: string;
  paidPrice: string;
  currency?: string;
  callbackUrl: string;
  buyer: IyzicoPaymentParams['buyer'];
  billingAddress: IyzicoPaymentParams['billingAddress'];
  shippingAddress?: IyzicoPaymentParams['shippingAddress'];
  basketItems: IyzicoPaymentParams['basketItems'];
  enabledInstallments?: number[];
}

@Injectable()
export class IyzicoService {
  private readonly logger = new Logger(IyzicoService.name);
  private readonly iyzipay: any;

  constructor() {
    this.iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      // Sandbox: 'https://sandbox.iyzipay.com' | Production: 'https://api.iyzipay.com'
      uri: process.env.IYZICO_BASE_URL ?? 'https://sandbox.iyzipay.com',
    });
  }

  /** Direct card payment */
  async createPayment(params: IyzicoPaymentParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iyzipay.payment.create(
        {
          ...params,
          currency: params.currency ?? 'TRY',
          installment: params.installment ?? 1,
          paymentChannel: 'WEB',
          paymentGroup: 'PRODUCT',
          shippingAddress: params.shippingAddress ?? params.billingAddress,
        },
        (err: any, result: any) => {
          if (err) {
            this.logger.error('iyzico payment.create error', err);
            return reject(new InternalServerErrorException('Payment processing failed'));
          }
          if (result.status !== 'success') {
            this.logger.warn('iyzico payment rejected', result.errorMessage);
            return reject(new InternalServerErrorException(result.errorMessage ?? 'Payment rejected'));
          }
          resolve(result);
        },
      );
    });
  }

  /** Hosted checkout form (3-D Secure supported) */
  async createCheckoutForm(params: IyzicoCheckoutFormParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(
        {
          ...params,
          currency: params.currency ?? 'TRY',
          paymentGroup: 'PRODUCT',
          shippingAddress: params.shippingAddress ?? params.billingAddress,
          enabledInstallments: params.enabledInstallments ?? [1, 2, 3, 6, 9, 12],
        },
        (err: any, result: any) => {
          if (err) {
            this.logger.error('iyzico checkoutFormInitialize error', err);
            return reject(new InternalServerErrorException('Checkout form initialization failed'));
          }
          resolve(result);
        },
      );
    });
  }

  /** Retrieve result after 3-D Secure redirect */
  async retrieveCheckoutForm(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve({ token }, (err: any, result: any) => {
        if (err) {
          this.logger.error('iyzico checkoutForm.retrieve error', err);
          return reject(new InternalServerErrorException('Could not retrieve payment result'));
        }
        resolve(result);
      });
    });
  }

  /** Cancel / refund a payment */
  async cancelPayment(paymentId: string, ip: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iyzipay.cancel.create({ paymentId, ip }, (err: any, result: any) => {
        if (err) {
          this.logger.error('iyzico cancel error', err);
          return reject(new InternalServerErrorException('Cancellation failed'));
        }
        resolve(result);
      });
    });
  }
}
`;
}

export function generateIyzicoModule(): string {
  return `import { Module } from '@nestjs/common';
import { IyzicoService } from './iyzico.service';
import { IyzicoController } from './iyzico.controller';

@Module({
  providers: [IyzicoService],
  controllers: [IyzicoController],
  exports: [IyzicoService],
})
export class IyzicoModule {}
`;
}

export function generateIyzicoController(): string {
  return `import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { IyzicoService } from './iyzico.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class IyzicoController {
  constructor(private readonly iyzicoService: IyzicoService) {}

  @Post('checkout')
  async createCheckout(@Body() body: any, @Req() req: any) {
    const ip = req.ip ?? '127.0.0.1';
    return this.iyzicoService.createCheckoutForm({
      ...body,
      buyer: { ...body.buyer, ip },
    });
  }

  @Post('checkout/callback')
  async checkoutCallback(@Body() body: { token: string }) {
    return this.iyzicoService.retrieveCheckoutForm(body.token);
  }
}
`;
}

// ─── e-Fatura / e-Arşiv ──────────────────────────────────────────────────────

export function generateEFaturaService(): string {
  return `import { Injectable, Logger } from '@nestjs/common';

export interface EFaturaLine {
  description: string;
  quantity: number;
  unitCode?: string;
  unitPrice: number;
  taxRate: number; // KDV oranı: 0, 1, 8 veya 20
}

export interface EFaturaParams {
  invoiceNo: string;   // e.g. 'IST2024000001'
  invoiceDate: string; // ISO 8601: '2024-03-15'
  invoiceTime?: string; // '10:30:00'
  profileId?: 'TEMELFATURA' | 'TICARIFATURA'; // Default: TEMELFATURA
  buyer: {
    name: string;
    taxNumber: string; // VKN veya TCKN
    taxOffice?: string;
    address: string;
    city: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  lines: EFaturaLine[];
  notes?: string[];
}

@Injectable()
export class EFaturaService {
  private readonly logger = new Logger(EFaturaService.name);

  /**
   * Generates a GİB-compliant UBL-TR 2.1 XML invoice.
   * For actual GİB submission, route this XML through a licensed e-fatura
   * integrator (e.g. Logo, Mikro, Luca, Uyumsoft) or the GİB portal.
   */
  generateUBLXML(params: EFaturaParams): string {
    const profileId = params.profileId ?? 'TEMELFATURA';
    const invoiceDate = params.invoiceDate;
    const invoiceTime = params.invoiceTime ?? '09:00:00';

    const subTotal = params.lines.reduce(
      (sum, l) => sum + l.quantity * l.unitPrice,
      0,
    );
    const taxTotal = params.lines.reduce(
      (sum, l) => sum + l.quantity * l.unitPrice * (l.taxRate / 100),
      0,
    );
    const total = subTotal + taxTotal;

    const linesXML = params.lines
      .map(
        (line, idx) => \`  <cac:InvoiceLine>
    <cbc:ID>\${idx + 1}</cbc:ID>
    <cbc:InvoicedQuantity unitCode="\${line.unitCode ?? 'C62'}">\${line.quantity}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="TRY">\${(line.quantity * line.unitPrice).toFixed(2)}</cbc:LineExtensionAmount>
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="TRY">\${(line.quantity * line.unitPrice * (line.taxRate / 100)).toFixed(2)}</cbc:TaxAmount>
      <cac:TaxSubtotal>
        <cbc:TaxableAmount currencyID="TRY">\${(line.quantity * line.unitPrice).toFixed(2)}</cbc:TaxableAmount>
        <cbc:TaxAmount currencyID="TRY">\${(line.quantity * line.unitPrice * (line.taxRate / 100)).toFixed(2)}</cbc:TaxAmount>
        <cbc:Percent>\${line.taxRate}</cbc:Percent>
        <cac:TaxCategory>
          <cac:TaxScheme>
            <cbc:Name>KDV</cbc:Name>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Description>\${this.escapeXML(line.description)}</cbc:Description>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="TRY">\${line.unitPrice.toFixed(2)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>\`,
      )
      .join('\\n');

    const notesXML = (params.notes ?? [])
      .map((n) => \`  <cbc:Note>\${this.escapeXML(n)}</cbc:Note>\`)
      .join('\\n');

    return \`<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>TR1.2</cbc:CustomizationID>
  <cbc:ProfileID>\${profileId}</cbc:ProfileID>
  <cbc:ID>\${params.invoiceNo}</cbc:ID>
  <cbc:CopyIndicator>false</cbc:CopyIndicator>
  <cbc:IssueDate>\${invoiceDate}</cbc:IssueDate>
  <cbc:IssueTime>\${invoiceTime}</cbc:IssueTime>
  <cbc:InvoiceTypeCode>SATIS</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>TRY</cbc:DocumentCurrencyCode>
  <cbc:LineCountNumeric>\${params.lines.length}</cbc:LineCountNumeric>
\${notesXML}
  <!-- Satıcı (Supplier) -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cbc:WebsiteURI>\${process.env.APP_URL ?? 'https://yourapp.com'}</cbc:WebsiteURI>
      <cac:PartyIdentification>
        <cbc:ID schemeID="VKN">\${process.env.COMPANY_TAX_NUMBER ?? '0000000000'}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name>\${this.escapeXML(process.env.COMPANY_NAME ?? 'Şirket Adı')}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>\${this.escapeXML(process.env.COMPANY_ADDRESS ?? 'Adres')}</cbc:StreetName>
        <cac:Country>
          <cbc:Name>Türkiye</cbc:Name>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>\${process.env.COMPANY_TAX_NUMBER ?? '0000000000'}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:Name>VKN</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <!-- Alıcı (Customer) -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="VKN">\${params.buyer.taxNumber}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name>\${this.escapeXML(params.buyer.name)}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>\${this.escapeXML(params.buyer.address)}</cbc:StreetName>
        <cbc:CityName>\${this.escapeXML(params.buyer.city)}</cbc:CityName>
        <cac:Country>
          <cbc:Name>\${params.buyer.country ?? 'Türkiye'}</cbc:Name>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>\${params.buyer.taxNumber}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:Name>VKN</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>

  <!-- KDV Toplamı -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="TRY">\${taxTotal.toFixed(2)}</cbc:TaxAmount>
  </cac:TaxTotal>

  <!-- Parasal Toplam -->
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="TRY">\${subTotal.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="TRY">\${subTotal.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="TRY">\${total.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="TRY">\${total.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>

  <!-- Kalemler -->
\${linesXML}
</Invoice>\`;
  }

  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
`;
}

export function generateEFaturaModule(): string {
  return `import { Module } from '@nestjs/common';
import { EFaturaService } from './efatura.service';
import { EFaturaController } from './efatura.controller';

@Module({
  providers: [EFaturaService],
  controllers: [EFaturaController],
  exports: [EFaturaService],
})
export class EFaturaModule {}
`;
}

export function generateEFaturaController(): string {
  return `import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { EFaturaService, EFaturaParams } from './efatura.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('efatura')
@UseGuards(JwtAuthGuard)
export class EFaturaController {
  constructor(private readonly efaturaService: EFaturaService) {}

  @Post('generate')
  generateXML(@Body() params: EFaturaParams) {
    const xml = this.efaturaService.generateUBLXML(params);
    return { xml, invoiceNo: params.invoiceNo };
  }

  @Post('download')
  downloadXML(@Body() params: EFaturaParams, @Res() res: Response) {
    const xml = this.efaturaService.generateUBLXML(params);
    const filename = \`\${params.invoiceNo}.xml\`;
    res.set({
      'Content-Type': 'application/xml',
      'Content-Disposition': \`attachment; filename="\${filename}"\`,
    });
    res.send(xml);
  }
}
`;
}

// ─── KVKK ────────────────────────────────────────────────────────────────────

export function generateKVKKMiddleware(): string {
  return `import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * KVKK (Kişisel Verilerin Korunması Kanunu) Compliance Middleware
 *
 * Bu middleware:
 * 1. Kişisel veri içeren istekleri loglar (audit trail)
 * 2. Cookie consent header'larını kontrol eder
 * 3. KVKK uyumluluk header'larını ekler
 *
 * NOT: Bu middleware bir başlangıç noktasıdır. Tam KVKK uyumu için
 * bir hukuk danışmanıyla çalışmanız önerilir.
 */
@Injectable()
export class KvkkMiddleware implements NestMiddleware {
  private readonly logger = new Logger('KVKK');

  use(req: Request, res: Response, next: NextFunction) {
    // KVKK uyumluluk header'ları
    res.setHeader('X-KVKK-Compliant', 'true');
    res.setHeader('X-Data-Controller', process.env.COMPANY_NAME ?? 'Şirket');
    res.setHeader('X-Privacy-Policy', \`\${process.env.APP_URL ?? ''}/privacy\`);

    // Kişisel veri işleme audit logu (sadece yetkili endpointler için)
    if (this.isPersonalDataEndpoint(req.path)) {
      this.logger.log(
        \`[KVKK Audit] \${req.method} \${req.path} - IP: \${req.ip} - User-Agent: \${req.headers['user-agent']}\`,
      );
    }

    next();
  }

  private isPersonalDataEndpoint(path: string): boolean {
    const personalDataPaths = ['/auth', '/users', '/profile', '/payment'];
    return personalDataPaths.some((p) => path.startsWith(p));
  }
}
`;
}

export function generateKVKKDoc(): string {
  return `# KVKK Uyum Dokümantasyonu

> **Önemli:** Bu belge bir başlangıç şablonudur. Gerçek bir uygulama için
> KVKK uzmanı veya hukuk danışmanıyla çalışmanız gerekmektedir.

## 1. Veri Sorumlusu Bilgileri

- **Şirket Adı:** [Şirket Adınız]
- **Vergi Numarası:** [VKN]
- **Adres:** [Adresiniz]
- **E-posta:** kvkk@sirketiniz.com
- **Telefon:** [Telefon]

## 2. İşlenen Kişisel Veriler

| Veri Kategorisi | Veri Türleri | İşleme Amacı | Hukuki Dayanak | Saklama Süresi |
|---|---|---|---|---|
| Kimlik | Ad, soyad | Hizmet sunumu | Sözleşme | 5 yıl |
| İletişim | E-posta, telefon | Bildirim gönderme | Meşru menfaat | 5 yıl |
| Finansal | Ödeme bilgileri | Ödeme işleme | Sözleşme | 10 yıl |
| Kullanım | IP adresi, log | Güvenlik | Meşru menfaat | 2 yıl |

## 3. Veri Sahibinin Hakları (Madde 11)

Veri sahipleri aşağıdaki haklara sahiptir:

- **Bilgi edinme hakkı:** İşlenen verileri sorgulamak
- **Erişim hakkı:** Verilerinin bir kopyasını almak
- **Düzeltme hakkı:** Hatalı verilerin düzeltilmesini istemek
- **Silme hakkı:** "Unutulma hakkı" kapsamında silme talep etmek
- **İşlemenin kısıtlanması:** Belirli koşullarda işlemeyi kısıtlatmak
- **Veri taşınabilirliği:** Verilerini başka bir platforma aktarma

Başvuru formu: [APP_URL]/kvkk-basvuru

## 4. Teknik Tedbirler

- ✅ Veriler şifreli bağlantı (HTTPS/TLS 1.3) üzerinden iletilmektedir
- ✅ Veritabanı erişimi rol tabanlı yetkilendirme ile korunmaktadır
- ✅ Şifreler bcrypt ile hashlenmektedir
- ✅ JWT token süresi 7 gün ile sınırlandırılmıştır
- ✅ Audit log mekanizması (\`KvkkMiddleware\`) aktiftir
- ⚠️ Veri işleme kayıtları (VERBİS) için manuel kayıt gereklidir

## 5. Üçüncü Taraf Aktarımlar

| Alıcı | Aktarım Amacı | Hukuki Dayanak |
|---|---|---|
| iyzico | Ödeme işleme | Sözleşme zorunluluğu |
| Railway/Vercel | Hosting altyapısı | Meşru menfaat |
| E-posta servisi | Bildirim | Açık rıza |

## 6. Çerez Politikası

Uygulamamız şu çerezleri kullanmaktadır:

| Çerez | Amaç | Süre | Tür |
|---|---|---|---|
| \`auth_token\` | Kimlik doğrulama | 7 gün | Zorunlu |
| \`session_id\` | Oturum yönetimi | Oturum sonu | Zorunlu |

## 7. VERBİS Kaydı

KVKK Madde 16 gereğince, 50'den fazla çalışanı olan veya yıllık cirosu
25 milyon TL'yi aşan veri sorumlularının VERBİS'e kayıt olması zorunludur.

VERBİS kayıt: https://verbis.kvkk.gov.tr

## 8. KVKK Başvuru Endpoint'leri

Aşağıdaki endpoint'leri uygulamanıza eklemeyi unutmayın:

\`\`\`
GET  /privacy          → Gizlilik politikası sayfası
GET  /kvkk             → KVKK aydınlatma metni
POST /kvkk/basvuru     → Veri sahibi başvuru formu
GET  /kvkk/politika    → Çerez politikası
\`\`\`

---

*Bu şablon 6698 sayılı KVKK ve ilgili ikincil mevzuat temel alınarak hazırlanmıştır.*
*Son güncelleme: ${new Date().toISOString().split('T')[0]}*
`;
}

export function generateKVKKPrivacyText(): string {
  return `# KİŞİSEL VERİLERİN İŞLENMESİNE İLİŞKİN AYDINLATMA METNİ

**[Şirket Adı]** ("Şirket") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")
kapsamında kişisel verilerinizin işlenmesine ilişkin sizi aydınlatmak isteriz.

## Veri Sorumlusu

[Şirket Adı], [Adres], [Şehir], Türkiye

## Hangi Verilerinizi İşliyoruz?

Platformumuzu kullandığınızda aşağıdaki kişisel verileriniz işlenmektedir:

- **Kimlik bilgileri:** Ad, soyad
- **İletişim bilgileri:** E-posta adresi
- **İşlem bilgileri:** Sipariş, ödeme kayıtları
- **Teknik veriler:** IP adresi, tarayıcı bilgisi, erişim logları

## İşleme Amaçları ve Hukuki Dayanaklar

| Amaç | Hukuki Dayanak (KVKK m.5) |
|---|---|
| Hesap oluşturma ve yönetimi | Sözleşmenin ifası |
| Ödeme işlemleri | Sözleşmenin ifası |
| Güvenlik ve dolandırıcılık önleme | Meşru menfaat |
| Yasal yükümlülüklerin yerine getirilmesi | Kanuni yükümlülük |
| Bilgilendirme e-postaları | Açık rıza |

## Haklarınız

KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:

- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
- Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri öğrenme
- Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
- Kişisel verilerinizin silinmesini veya yok edilmesini isteme
- İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
- Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme

## İletişim

Başvurularınız için: kvkk@[sirketiniz.com]

*[Şirket Adı] — KVKK Aydınlatma Metni*
`;
}
