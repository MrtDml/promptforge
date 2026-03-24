import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ParserModule } from '../parser/parser.module';
import { GeneratorModule } from '../generator/generator.module';

@Module({
  imports: [ParserModule, GeneratorModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
