import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(SubscriptionGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.id;

    if (!userId) {
      // JwtAuthGuard should run before this guard — if no user, deny access
      throw new ForbiddenException('Authentication required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        generationsUsed: true,
        generationsLimit: true,
        planType: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const { generationsUsed, generationsLimit, planType } = user;

    // -1 means unlimited (Pro plan)
    if (generationsLimit === -1) {
      return true;
    }

    if (generationsUsed >= generationsLimit) {
      this.logger.warn(
        `User ${userId} has reached their generation limit (${generationsUsed}/${generationsLimit}, plan: ${planType})`,
      );
      throw new ForbiddenException(
        `You have used all ${generationsLimit} generations on your ${planType ?? 'free'} plan. ` +
          `Please upgrade to a paid plan to generate more projects.`,
      );
    }

    return true;
  }
}
