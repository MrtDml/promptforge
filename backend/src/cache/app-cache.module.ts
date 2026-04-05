import { Global, Module, Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

const logger = new Logger('AppCacheModule');

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
          logger.warn('REDIS_URL not set — using in-memory cache (data lost on restart)');
          return { ttl: 60_000 };
        }

        try {
          const { redisStore } = await import('cache-manager-redis-yet');
          const store = await redisStore({
            url: redisUrl,
            ttl: 60, // seconds (default)
          });
          logger.log('Redis cache connected');
          return { store };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          logger.error(`Redis cache connection failed: ${message} — falling back to in-memory`);
          return { ttl: 60_000 };
        }
      },
    }),
  ],
})
export class AppCacheModule {}
