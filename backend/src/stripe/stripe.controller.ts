import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';

@Controller('stripe')
export class StripeController {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  /**
   * POST /api/v1/stripe/checkout
   * iyzico abonelik ödeme formu oluşturur ve yönlendirme URL'si döner.
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

    const url = await this.stripeService.createIyzicoCheckout(
      userId,
      email,
      name || user.name,
      planType,
    );

    this.logger.log(`iyzico checkout oluşturuldu: kullanıcı=${userId}, plan=${planType}`);
    return { url };
  }

  /**
   * POST /api/v1/stripe/portal
   * Kullanıcıyı abonelik yönetim sayfasına yönlendirir.
   */
  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createPortalSession(
    @Req() req: Request & { user: { id: string } },
  ) {
    const url = await this.stripeService.createPortalSession('');
    return { url };
  }

  /**
   * POST /api/v1/stripe/cancel
   * Kullanıcının aktif aboneliğini iptal eder.
   */
  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(
    @Req() req: Request & { user: { id: string } },
  ) {
    await this.stripeService.cancelSubscription(req.user.id);
    return { message: 'Abonelik iptal edildi. Free plana geçtiniz.' };
  }

  /**
   * POST /api/v1/stripe/webhook
   * iyzico ödeme callback'i — form-data (application/x-www-form-urlencoded) alır.
   * JWT gerekmez.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Req() req: Request) {
    const body = req.body as Record<string, string>;

    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Geçersiz webhook body');
    }

    this.logger.log(`iyzico webhook alındı: status=${body.status}`);
    await this.stripeService.handleWebhookCallback(body);
    return { received: true };
  }
}
