import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReferralService } from './referral.service';
import { IsString, MinLength, MaxLength } from 'class-validator';

class ApplyReferralDto {
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  code: string;
}

@Controller('referral')
@UseGuards(JwtAuthGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  /** GET /api/v1/referral — returns referral code + stats for the current user */
  @Get()
  async getMyReferral(@Request() req: any) {
    return this.referralService.getStats(req.user.id);
  }

  /** POST /api/v1/referral/apply — apply someone else's referral code */
  @Post('apply')
  @HttpCode(HttpStatus.OK)
  async applyCode(@Request() req: any, @Body() dto: ApplyReferralDto) {
    await this.referralService.applyReferralCode(req.user.id, dto.code);
    return { message: 'Referral code applied successfully!' };
  }
}
