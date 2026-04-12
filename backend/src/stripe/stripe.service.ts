import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PLANS, PlanType } from './plans.config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require('iyzipay');

type IyzipayCallback<T> = (err: { message?: string } | null, result: T) => void;

interface IyzipayFormResult {
  status: string;
  token?: string;
  errorMessage?: string;
  subscriptionStatus?: string;
  subscriptionReferenceCode?: string;
  pricingPlanReferenceCode?: string;
  customerReferenceCode?: string;
  conversationId?: string;
}

interface IyzipayClient {
  subscriptionCheckoutForm: {
    initialize: (params: Record<string, unknown>, cb: IyzipayCallback<IyzipayFormResult>) => void;
    retrieve: (params: Record<string, unknown>, cb: IyzipayCallback<IyzipayFormResult>) => void;
  };
  subscription: {
    cancel: (params: Record<string, unknown>, cb: IyzipayCallback<IyzipayFormResult>) => void;
  };
}

@Injectable()
export class StripeService {
  private readonly iyzipay: IyzipayClient | null;
  private readonly logger = new Logger('IyzicoService');

  private readonly baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://api.iyzipay.com'
      : 'https://sandbox.iyzipay.com';

  private readonly appUrl =
    process.env.APP_URL || 'http://localhost:3001';

  private readonly frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:3000';

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;

    if (!apiKey || !secretKey) {
      this.logger.warn(
        'IYZICO_API_KEY veya IYZICO_SECRET_KEY tanımlı değil — ödeme özellikleri devre dışı.',
      );
      this.iyzipay = null;
      return;
    }

    this.iyzipay = new Iyzipay({
      apiKey,
      secretKey,
      uri: this.baseUrl,
    });
  }

  // ─── Promise wrapper ────────────────────────────────────────────────────────

  private call<T extends IyzipayFormResult>(
    method: (cb: IyzipayCallback<T>) => void,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      method((err, result) => {
        if (err) {
          reject(new Error(err.message || 'iyzico isteği başarısız'));
          return;
        }
        if (result?.status === 'failure') {
          reject(new Error(result.errorMessage || 'iyzico işlemi başarısız'));
          return;
        }
        resolve(result);
      });
    });
  }

  // ─── Checkout ───────────────────────────────────────────────────────────────

  /**
   * iyzico abonelik ödeme formu oluşturur ve yönlendirme URL'si döner.
   */
  async createCheckoutSession(
    _customerId: string,  // iyzico'da kullanılmıyor (Stripe uyumluluğu için)
    _priceId: string,     // iyzico'da plan referansı kullanılıyor
    userId: string,
  ): Promise<string> {
    throw new InternalServerErrorException(
      'createCheckoutSession yerine createIyzicoCheckout kullanın.',
    );
  }

  async createIyzicoCheckout(
    userId: string,
    userEmail: string,
    userName: string,
    planType: PlanType,
  ): Promise<string> {
    if (!this.iyzipay) {
      throw new InternalServerErrorException(
        'iyzico yapılandırılmamış. IYZICO_API_KEY ve IYZICO_SECRET_KEY gerekli.',
      );
    }

    const plan = PLANS[planType];

    if (!plan.iyzicoReferenceCode) {
      throw new InternalServerErrorException(
        `"${planType}" planı için iyzico referans kodu yapılandırılmamış.`,
      );
    }

    const nameParts = userName.trim().split(' ');
    const firstName = nameParts[0] || 'Kullanıcı';
    const lastName = nameParts.slice(1).join(' ') || '-';

    const result = await this.call((cb) =>
      this.iyzipay!.subscriptionCheckoutForm.initialize(
        {
          locale: 'tr',
          conversationId: userId,
          customer: {
            name: firstName,
            surname: lastName,
            email: userEmail,
            billingAddress: {
              contactName: userName,
              city: 'Istanbul',
              country: 'Turkey',
              address: 'Adres belirtilmedi',
              zipCode: '34000',
            },
          },
          pricingPlanReferenceCode: plan.iyzicoReferenceCode,
          subscriptionInitialStatus: 'ACTIVE',
          callbackUrl: `${this.appUrl}/api/v1/payment/webhook`,
        },
        cb,
      ),
    );

    // iyzico token'ı ile yönlendirme URL'si oluştur
    return `${this.baseUrl}/v2/subscription/form?token=${result.token}&locale=tr`;
  }

  // ─── Portal (abonelik yönetimi) ─────────────────────────────────────────────

  /**
   * iyzico'nun yerleşik bir portal sayfası yok.
   * Kullanıcıyı aboneliğini iptal edebileceği dashboard sayfasına yönlendir.
   */
  async createPortalSession(_customerId: string): Promise<string> {
    return `${this.frontendUrl}/dashboard/settings?tab=billing`;
  }

  // ─── Abonelik iptal ─────────────────────────────────────────────────────────

  async cancelSubscription(userId: string): Promise<void> {
    if (!this.iyzipay) {
      throw new InternalServerErrorException('iyzico yapılandırılmamış.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user?.subscriptionId) {
      throw new InternalServerErrorException('Aktif abonelik bulunamadı.');
    }

    await this.call((cb) =>
      this.iyzipay!.subscription.cancel(
        { locale: 'tr', subscriptionReferenceCode: user.subscriptionId },
        cb,
      ),
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        planType: 'free',
        generationsLimit: PLANS.free.generationsLimit,
        subscriptionId: null,
        subscriptionStatus: 'cancelled',
      },
    });

    this.logger.log(`Kullanıcı ${userId} aboneliğini iptal etti → free plan`);
  }

  // ─── Webhook callback işleme ─────────────────────────────────────────────────

  /**
   * iyzico ödeme tamamlandığında callbackUrl'ye form-data gönderir.
   * Body içinde `token` gelir; bu token ile abonelik detaylarını alırız.
   */
  async handleWebhookCallback(body: Record<string, string>): Promise<void> {
    const { token, status } = body;

    if (!token) {
      this.logger.warn('iyzico callback: token eksik');
      return;
    }

    if (status === 'failure') {
      this.logger.warn(`iyzico callback başarısız: ${JSON.stringify(body)}`);
      return;
    }

    // Token ile abonelik formunu doğrula ve detayları al
    if (!this.iyzipay) {
      this.logger.error('iyzico webhook: iyzipay yapılandırılmamış');
      return;
    }

    let result: IyzipayFormResult;
    try {
      result = await this.call((cb) =>
        this.iyzipay!.subscriptionCheckoutForm.retrieve({ locale: 'tr', token }, cb),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`iyzico checkout formu doğrulanamadı: ${message}`);
      return;
    }

    const {
      subscriptionStatus,
      subscriptionReferenceCode,
      pricingPlanReferenceCode,
      customerReferenceCode,
      conversationId, // userId olarak set etmiştik
    } = result;

    const userId = conversationId || customerReferenceCode;

    if (!userId) {
      this.logger.error('iyzico callback: userId (conversationId) bulunamadı');
      return;
    }

    if (subscriptionStatus !== 'ACTIVE') {
      this.logger.warn(`iyzico callback: subscriptionStatus=${subscriptionStatus}`);
      return;
    }

    // Plan türünü referans kodundan belirle
    const planEntry = Object.entries(PLANS).find(
      ([, p]) => p.iyzicoReferenceCode === pricingPlanReferenceCode,
    );

    if (!planEntry) {
      this.logger.error(`Bilinmeyen iyzico plan referansı: ${pricingPlanReferenceCode}`);
      return;
    }

    const [planType, plan] = planEntry as [PlanType, (typeof PLANS)[PlanType]];

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        planType,
        generationsLimit: plan.generationsLimit,
        generationsUsed: 0,
        subscriptionId: subscriptionReferenceCode,
        subscriptionStatus: 'active',
      },
    });

    this.logger.log(`Kullanıcı ${userId} → ${planType} planına geçti`);
  }

  // ─── Stripe uyumluluğu için stub (kullanılmıyor) ────────────────────────────

  async createCustomer(_email: string, _name: string): Promise<{ id: string }> {
    return { id: 'iyzico_no_customer_id' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleWebhookEvent(_payload: Buffer, _signature: string): Promise<void> {
    // iyzico raw-body webhook kullanmıyor; handleWebhookCallback kullan
  }
}
