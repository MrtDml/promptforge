import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController, PublicProjectsController } from './projects.controller';
import { ParserModule } from '../parser/parser.module';
import { GeneratorModule } from '../generator/generator.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [ParserModule, GeneratorModule, QueueModule],
  controllers: [ProjectsController, PublicProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
