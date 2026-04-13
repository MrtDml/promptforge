import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AutomationService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Daily KPI Stats ──────────────────────────────────────────────────────

  async getStats() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      totalProjects,
      projectsToday,
      projectsThisWeek,
      planBreakdown,
      verifiedUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.project.count(),
      this.prisma.project.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.project.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.user.groupBy({
        by: ['planType'],
        _count: { planType: true },
      }),
      this.prisma.user.count({ where: { emailVerified: true } }),
    ]);

    return {
      generatedAt: now.toISOString(),
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
      },
      projects: {
        total: totalProjects,
        createdToday: projectsToday,
        createdThisWeek: projectsThisWeek,
      },
      plans: planBreakdown.map((p) => ({
        plan: p.planType ?? 'free',
        count: p._count.planType,
      })),
    };
  }

  // ─── Inactive Users (14+ days, 0 projects) ────────────────────────────────

  async getInactiveUsers() {
    const threshold = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: { lte: threshold },
        emailVerified: true,
        projects: { none: {} },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        planType: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return { count: users.length, users };
  }

  // ─── Expiring Subscriptions (within 3 days) ───────────────────────────────

  async getExpiringSubscriptions() {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: 'active',
        cancelAtPeriodEnd: true,
        currentPeriodEnd: { gte: now, lte: threeDaysLater },
      },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { currentPeriodEnd: 'asc' },
    });

    return {
      count: subscriptions.length,
      subscriptions: subscriptions.map((s) => ({
        userId: s.userId,
        email: s.user.email,
        name: s.user.name,
        plan: s.planType,
        expiresAt: s.currentPeriodEnd.toISOString(),
        daysLeft: Math.ceil((s.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      })),
    };
  }

  // ─── Drip Campaign Targets ────────────────────────────────────────────────
  //
  // day=1 → registered 20-28h ago (all users — welcome tutorial)
  // day=3 → registered 3 days ago, 0 projects (still stuck?)
  // day=7 → registered 7 days ago, still on free plan (upgrade CTA)

  async getDripTargets(day: 1 | 3 | 7) {
    const now = new Date();

    const windows: Record<number, { from: number; to: number }> = {
      1: { from: 28, to: 20 }, // 20–28 hours ago
      3: { from: 76, to: 68 }, // 68–76 hours ago
      7: { from: 172, to: 164 }, // 164–172 hours ago
    };

    const { from, to } = windows[day];
    const createdBefore = new Date(now.getTime() - to * 60 * 60 * 1000);
    const createdAfter = new Date(now.getTime() - from * 60 * 60 * 1000);

    const baseWhere = {
      createdAt: { gte: createdAfter, lte: createdBefore },
      emailVerified: true,
    };

    const where =
      day === 3
        ? { ...baseWhere, projects: { none: {} } }
        : day === 7
          ? { ...baseWhere, planType: 'free' }
          : baseWhere;

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        planType: true,
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return {
      day,
      count: users.length,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        plan: u.planType,
        projectCount: u._count.projects,
        registeredAt: u.createdAt.toISOString(),
      })),
    };
  }
}
