import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ParserModule } from '../parser/parser.module';
import { GeneratorModule } from '../generator/generator.module';
import { MailModule } from '../mail/mail.module';
import { GenerationProcessor } from './generation.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'generation',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: 100, // keep last 100 completed jobs
        removeOnFail: 50,      // keep last 50 failed jobs
      },
    }),
    ParserModule,
    GeneratorModule,
    MailModule,
  ],
  providers: [GenerationProcessor],
  exports: [BullModule],
})
export class QueueModule {}
