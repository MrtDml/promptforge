import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ParserModule } from './parser/parser.module';
import { GeneratorModule } from './generator/generator.module';
import { ProjectsModule } from './projects/projects.module';
import { StripeModule } from './stripe/stripe.module';
import { DeployModule } from './deploy/deploy.module';
import { GithubModule } from './github/github.module';
import { ChatModule } from './chat/chat.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { BlogModule } from './blog/blog.module';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionGuard } from './common/guards/subscription.guard';
import { AppCacheModule } from './cache/app-cache.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
      },
    ]),
    BullModule.forRoot({
      redis: process.env.REDIS_URL || 'redis://localhost:6379',
    }),
    AppCacheModule,
    AuthModule,
    UsersModule,
    ParserModule,
    GeneratorModule,
    ProjectsModule,
    StripeModule,
    DeployModule,
    GithubModule,
    ChatModule,
    MailModule,
    AdminModule,
    BlogModule,
    AiModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, SubscriptionGuard],
})
export class AppModule {}
