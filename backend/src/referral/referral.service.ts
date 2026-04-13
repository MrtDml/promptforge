import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const REFERRAL_BONUS_GENERATIONS = 3; // referrer gets +3 generations per successful referral

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Returns (or lazily creates) the referral code for a user. */
  async getOrCreateReferralCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });

    if (user?.referralCode) return user.referralCode;

    // Generate a short unique code: 8 hex chars
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });
    return code;
  }

  /** Returns stats: how many users were referred + total bonus earned. */
  async getStats(userId: string) {
    const code = await this.getOrCreateReferralCode(userId);
    const referralCount = await this.prisma.user.count({
      where: { referredById: userId },
    });

    return {
      referralCode: code,
      referralCount,
      bonusEarned: referralCount * REFERRAL_BONUS_GENERATIONS,
      bonusPerReferral: REFERRAL_BONUS_GENERATIONS,
    };
  }

  /**
   * Called during registration when a referral code is provided.
   * Links the new user to the referrer and increments referrer's limit.
   */
  async applyReferralCode(newUserId: string, code: string): Promise<void> {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode: code.toUpperCase() },
      select: { id: true },
    });

    if (!referrer) {
      throw new BadRequestException(`Referral code "${code}" is invalid.`);
    }

    if (referrer.id === newUserId) {
      throw new BadRequestException('You cannot use your own referral code.');
    }

    // Link the new user to referrer
    await this.prisma.user.update({
      where: { id: newUserId },
      data: { referredById: referrer.id },
    });

    // Reward the referrer
    await this.prisma.user.update({
      where: { id: referrer.id },
      data: { generationsLimit: { increment: REFERRAL_BONUS_GENERATIONS } },
    });

    this.logger.log(
      `Referral applied: ${newUserId} referred by ${referrer.id} (+${REFERRAL_BONUS_GENERATIONS} generations)`,
    );
  }
}
