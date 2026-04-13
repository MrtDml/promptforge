import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { PlanThrottlerGuard } from './common/guards/plan-throttler.guard';
import { ReferralModule } from './referral/referral.module';
import { AppCacheModule } from './cache/app-cache.module';
import { AutomationModule } from './automation/automation.module';
import { AssistantModule } from './assistant/assistant.module';

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
    ReferralModule,
    AutomationModule,
    AssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService, SubscriptionGuard, { provide: APP_GUARD, useClass: PlanThrottlerGuard }],
})
export class AppModule {}
