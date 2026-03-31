import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';

/**
 * Plan-aware rate limiter.
 *
 * Limits per minute by plan:
 *   free     → 30 requests / 60 s
 *   starter  → 100 requests / 60 s
 *   pro      → 300 requests / 60 s
 *   admin    → unlimited (skip)
 */
const PLAN_LIMITS: Record<string, number> = {
  free: 30,
  starter: 100,
  pro: 300,
};

@Injectable()
export class PlanThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Key per user id (or IP for anonymous)
    return req.user?.id ?? req.ip;
  }

  protected getThrottlers(context: ExecutionContext): Promise<ThrottlerOptions[]> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // Admins are not throttled
    if (user?.role === 'ADMIN') {
      return Promise.resolve([{ ttl: 60_000, limit: 10_000 }]);
    }

    const plan: string = user?.planType ?? 'free';
    const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

    return Promise.resolve([{ ttl: 60_000, limit }]);
  }
}
