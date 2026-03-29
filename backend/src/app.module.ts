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
    AuthModule,
    UsersModule,
    ParserModule,
    GeneratorModule,
    ProjectsModule,
    StripeModule,
    DeployModule,
    GithubModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
