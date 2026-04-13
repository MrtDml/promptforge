import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../common/guards/subscription.guard';
import { JwtRequest } from '../common/types/jwt-request.type';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProjectDto: CreateProjectDto, @Request() req: JwtRequest) {
    return this.projectsService.create(req.user.id, createProjectDto);
  }

  @Get()
  findAll(@Request() req: JwtRequest, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.projectsService.findAllByUser(req.user.id, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: JwtRequest) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: JwtRequest,
  ) {
    return this.projectsService.update(id, req.user.id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Request() req: JwtRequest) {
    return this.projectsService.remove(id, req.user.id);
  }

  @Post(':id/regenerate')
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.OK)
  regenerate(@Param('id') id: string, @Request() req: JwtRequest) {
    return this.projectsService.regenerate(id, req.user.id);
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  toggleShare(@Param('id') id: string, @Request() req: JwtRequest) {
    return this.projectsService.toggleShare(id, req.user.id);
  }
}

@Controller('projects/public')
export class PublicProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  listPublic() {
    return this.projectsService.listPublicProjects();
  }

  @Get(':shareToken')
  @HttpCode(HttpStatus.OK)
  findPublic(@Param('shareToken') shareToken: string) {
    return this.projectsService.findByShareToken(shareToken);
  }
}
