import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PLANS, PlanType } from './plans.config';
import * as crypto from 'crypto';

@Injectable()
export class StripeService {
  private readonly logger = new Logger('PayTRService');

  private readonly merchantId = process.env.PAYTR_MERCHANT_ID ?? '';
  private readonly merchantKey = process.env.PAYTR_MERCHANT_KEY ?? '';
  private readonly merchantSalt = process.env.PAYTR_MERCHANT_SALT ?? '';
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  private readonly testMode = process.env.PAYTR_TEST_MODE ?? '1';

  constructor(private readonly prisma: PrismaService) {
    if (!this.merchantId || !this.merchantKey || !this.merchantSalt) {
      this.logger.warn('PAYTR_MERCHANT_ID/KEY/SALT tanımlı değil — ödeme özellikleri devre dışı.');
    }
  }

  async createPaytrToken(
    userId: string,
    userEmail: string,
    userName: string,
    planType: PlanType,
    userIp: string,
  ): Promise<string> {
    if (!this.merchantId) {
      throw new InternalServerErrorException('PayTR yapılandırılmamış.');
    }

    const plan = PLANS[planType];
    const amountKurus = plan.priceTRY * 100;

    // merchant_oid: PF{P|S}{epochSeconds}{cuid} — sadece alfanümerik (PayTR zorunluluğu)
    // Parse: [2]=planCode, [3..12]=epoch(10 rakam), [13..]=userId(cuid)
    const planCode = planType === 'starter' ? 'S' : 'P';
    const epochSec = Math.floor(Date.now() / 1000);
    const merchantOid = `PF${planCode}${epochSec}${userId}`;

    const userBasket = Buffer.from(
      JSON.stringify([[`PromptForge ${plan.name}`, plan.priceTRY.toFixed(2), 1]]),
    ).toString('base64');

    const currency = 'TL';
    const noInstallment = '1';
    const maxInstallment = '0';

    // Hash: PayTR resmi örneğine göre — user_basket dahil, payment_type/instalment hariç
    const hashStr =
      this.merchantId +
      userIp +
      merchantOid +
      userEmail +
      String(amountKurus) +
      userBasket +
      noInstallment +
      maxInstallment +
      currency +
      this.testMode;

    const paytrToken = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr + this.merchantSalt)
      .digest('base64');

    const params = new URLSearchParams({
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      merchant_salt: this.merchantSalt,
      email: userEmail,
      payment_amount: String(amountKurus),
      merchant_oid: merchantOid,
      user_name: userName,
      user_address: 'Türkiye',
      user_phone: '05000000000',
      merchant_ok_url: `${this.frontendUrl}/payment/success`,
      merchant_fail_url: `${this.frontendUrl}/payment/failed`,
      user_basket: userBasket,
      user_ip: userIp,
      timeout_limit: '30',
      debug_on: '1',
      test_mode: this.testMode,
      lang: 'tr',
      no_installment: noInstallment,
      max_installment: maxInstallment,
      currency,
      paytr_token: paytrToken,
    });

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = (await response.json()) as { status: string; token?: string; reason?: string };

    if (data.status !== 'success' || !data.token) {
      this.logger.error(`PayTR token hatası: ${data.reason}`);
      throw new InternalServerErrorException(`Ödeme başlatılamadı: ${data.reason}`);
    }

    this.logger.log(`PayTR token oluşturuldu: ${merchantOid}`);
    return data.token;
  }

  async handleWebhookCallback(body: Record<string, string>): Promise<void> {
    const { merchant_oid, status, total_amount, hash } = body;

    // Webhook hash doğrulaması
    const expectedHash = crypto
      .createHmac('sha256', this.merchantKey)
      .update(merchant_oid + this.merchantSalt + status + total_amount)
      .digest('base64');

    if (expectedHash !== hash) {
      this.logger.error('PayTR webhook: hash doğrulaması başarısız');
      return;
    }

    if (status !== 'success') {
      this.logger.warn(`PayTR webhook: ödeme başarısız (${merchant_oid})`);
      return;
    }

    // merchant_oid parse: PF{P|S}{epoch10}{cuid}
    if (!merchant_oid.startsWith('PF') || merchant_oid.length < 14) {
      this.logger.error(`Geçersiz merchant_oid formatı: ${merchant_oid}`);
      return;
    }

    const planCode = merchant_oid[2];
    const userId = merchant_oid.slice(13);
    const planType: PlanType = planCode === 'S' ? 'starter' : 'pro';
    const plan = PLANS[planType];

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        planType,
        generationsLimit: plan.generationsLimit,
        generationsUsed: 0,
        subscriptionId: merchant_oid,
        subscriptionStatus: 'active',
      },
    });

    this.logger.log(`Kullanıcı ${userId} → ${planType} planına geçti`);
  }

  async cancelSubscription(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user?.subscriptionId || user.subscriptionStatus !== 'active') {
      throw new InternalServerErrorException('Aktif abonelik bulunamadı.');
    }

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

  async createPortalSession(_customerId: string): Promise<string> {
    return `${this.frontendUrl}/dashboard/settings?tab=billing`;
  }

  // Eski Stripe uyumluluk stub'ları
  async createCustomer(_email: string, _name: string): Promise<{ id: string }> {
    return { id: 'paytr_no_customer_id' };
  }

  async handleWebhookEvent(_payload: Buffer, _signature: string): Promise<void> {}
}
