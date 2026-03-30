import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dbUrl = PrismaService.buildDatabaseUrl(process.env.DATABASE_URL ?? '');
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      datasources: { db: { url: dbUrl } },
    });
  }

  /**
   * Ensures connection_limit and pool_timeout are present in the URL.
   * Respects values that are already set by the caller (e.g., DATABASE_URL
   * already contains ?connection_limit=5).
   */
  private static buildDatabaseUrl(url: string): string {
    try {
      const parsed = new URL(url);
      if (!parsed.searchParams.has('connection_limit')) {
        parsed.searchParams.set('connection_limit', '10');
      }
      if (!parsed.searchParams.has('pool_timeout')) {
        parsed.searchParams.set('pool_timeout', '10');
      }
      return parsed.toString();
    } catch {
      // Non-parseable URL (e.g. empty string in tests) — return as-is
      return url;
    }
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
