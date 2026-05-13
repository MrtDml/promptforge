import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payment')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * POST /api/v1/payment/checkout
   * PayTR iFrame token oluşturur. Frontend token'ı iFrame URL'si için kullanır.
   */
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(
    @Req() req: Request & { user: { id: string; email: string; name: string } },
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    const { id: userId, email, name } = req.user;
    const { planType } = createCheckoutDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    const userIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      '127.0.0.1';

    const token = await this.stripeService.createPaytrToken(
      userId,
      email,
      name || user.name,
      planType,
      userIp,
    );

    this.logger.log(`PayTR checkout oluşturuldu: kullanıcı=${userId}, plan=${planType}`);
    return { token };
  }

  /**
   * POST /api/v1/payment/portal
   * Kullanıcıyı abonelik yönetim sayfasına yönlendirir.
   */
  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createPortalSession(@Req() req: Request & { user: { id: string } }) {
    const url = await this.stripeService.createPortalSession(req.user.id);
    return { url };
  }

  /**
   * POST /api/v1/payment/cancel
   * Kullanıcının aktif aboneliğini iptal eder.
   */
  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@Req() req: Request & { user: { id: string } }) {
    await this.stripeService.cancelSubscription(req.user.id);
    return { message: 'Abonelik iptal edildi. Free plana geçtiniz.' };
  }

  /**
   * POST /api/v1/payment/webhook
   * PayTR ödeme sonucu bildirimi — form-data (application/x-www-form-urlencoded) alır.
   * JWT gerekmez. PayTR MUTLAKA "OK" text yanıtı bekler.
   */
  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const body = req.body as Record<string, string>;

    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Geçersiz webhook body');
    }

    this.logger.log(`PayTR webhook alındı: status=${body.status}, oid=${body.merchant_oid}`);

    try {
      await this.stripeService.handleWebhookCallback(body);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`PayTR webhook işlenemedi: ${message}`);
    }

    // PayTR "OK" yanıtı almazsa ödemeyi tekrar gönderir
    return res.send('OK');
  }
}
