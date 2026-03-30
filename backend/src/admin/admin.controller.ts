import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog-post.dto';
import { UpdateSettingsDto } from './dto/update-setting.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Stats ───────────────────────────────────────────────────────────────

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  // ─── Users ───────────────────────────────────────────────────────────────

  @Get('users')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(page, limit, search);
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ─── Projects ────────────────────────────────────────────────────────────

  @Get('projects')
  getProjects(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getProjects(page, limit, status, search);
  }

  @Delete('projects/:id')
  @HttpCode(HttpStatus.OK)
  deleteProject(@Param('id') id: string) {
    return this.adminService.deleteProject(id);
  }

  // ─── Blog ────────────────────────────────────────────────────────────────

  @Get('blog')
  getBlogPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getBlogPosts(page, limit);
  }

  @Get('blog/:id')
  getBlogPostById(@Param('id') id: string) {
    return this.adminService.getBlogPostById(id);
  }

  @Post('blog')
  createBlogPost(@Body() dto: CreateBlogPostDto) {
    return this.adminService.createBlogPost(dto);
  }

  @Patch('blog/:id')
  updateBlogPost(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.adminService.updateBlogPost(id, dto);
  }

  @Delete('blog/:id')
  @HttpCode(HttpStatus.OK)
  deleteBlogPost(@Param('id') id: string) {
    return this.adminService.deleteBlogPost(id);
  }

  // ─── Settings ────────────────────────────────────────────────────────────

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.adminService.upsertSettings(dto.settings);
  }
}
