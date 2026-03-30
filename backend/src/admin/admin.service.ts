import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AdminUpdateUserDto } from './dto/update-user.dto';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog-post.dto';
import { SettingItemDto } from './dto/update-setting.dto';

@Injectable()
export class AdminService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(AdminService.name);

  // ─── Stats ────────────────────────────────────────────────────────────────

  async getStats() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      totalProjects,
      completedProjects,
      newProjectsThisWeek,
      totalBlogPosts,
      publishedBlogPosts,
      planBreakdown,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: 'COMPLETED' } }),
      this.prisma.project.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.blogPost.count(),
      this.prisma.blogPost.count({ where: { published: true } }),
      this.prisma.user.groupBy({
        by: ['planType'],
        _count: { planType: true },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisWeek: newUsersThisWeek,
      },
      projects: {
        total: totalProjects,
        completed: completedProjects,
        newThisWeek: newProjectsThisWeek,
      },
      blog: {
        total: totalBlogPosts,
        published: publishedBlogPosts,
      },
      planBreakdown: planBreakdown.map((p) => ({
        plan: p.planType ?? 'free',
        count: p._count.planType,
      })),
    };
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          role: true,
          planType: true,
          generationsUsed: true,
          generationsLimit: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { projects: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        isActive: true,
        role: true,
        planType: true,
        subscriptionStatus: true,
        generationsUsed: true,
        generationsLimit: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
            tags: true,
          },
        },
        _count: { select: { projects: true } },
      },
    });

    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async updateUser(id: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.planType !== undefined && { planType: dto.planType }),
        ...(dto.role !== undefined && { role: dto.role as any }),
        ...(dto.generationsLimit !== undefined && { generationsLimit: dto.generationsLimit }),
        ...(dto.generationsUsed !== undefined && { generationsUsed: dto.generationsUsed }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        role: true,
        planType: true,
        generationsUsed: true,
        generationsLimit: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`Admin updated user ${id}`);
    return updated;
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    await this.prisma.user.delete({ where: { id } });
    this.logger.log(`Admin deleted user ${id}`);
    return { message: 'User deleted successfully' };
  }

  // ─── Projects ─────────────────────────────────────────────────────────────

  async getProjects(page = 1, limit = 20, status?: string, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          tags: true,
          deployStatus: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteProject(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    await this.prisma.project.delete({ where: { id } });
    this.logger.log(`Admin deleted project ${id}`);
    return { message: 'Project deleted successfully' };
  }

  // ─── Blog ─────────────────────────────────────────────────────────────────

  async getBlogPosts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blogPost.count(),
    ]);
    return { data: posts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getBlogPostById(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Blog post ${id} not found`);
    return post;
  }

  async createBlogPost(dto: CreateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" already exists`);

    const post = await this.prisma.blogPost.create({ data: dto });
    this.logger.log(`Admin created blog post: ${dto.slug}`);
    return post;
  }

  async updateBlogPost(id: string, dto: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Blog post ${id} not found`);

    if (dto.slug && dto.slug !== post.slug) {
      const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException(`Slug "${dto.slug}" already exists`);
    }

    const updated = await this.prisma.blogPost.update({ where: { id }, data: dto });
    this.logger.log(`Admin updated blog post: ${id}`);
    return updated;
  }

  async deleteBlogPost(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Blog post ${id} not found`);
    await this.prisma.blogPost.delete({ where: { id } });
    this.logger.log(`Admin deleted blog post: ${id}`);
    return { message: 'Blog post deleted successfully' };
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  async getSettings() {
    const settings = await this.prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    // Seed default settings if none exist
    if (settings.length === 0) {
      await this.seedDefaultSettings();
      return this.prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
    }

    return settings;
  }

  async upsertSettings(items: SettingItemDto[]) {
    await Promise.all(
      items.map((item) =>
        this.prisma.siteSetting.upsert({
          where: { key: item.key },
          update: { value: item.value, label: item.label },
          create: { key: item.key, value: item.value, label: item.label },
        }),
      ),
    );
    this.logger.log(`Admin updated ${items.length} settings`);
    return this.prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
  }

  private async seedDefaultSettings() {
    const defaults = [
      { key: 'site_name', value: 'PromptForge', label: 'Site Name' },
      { key: 'site_description', value: 'AI SaaS Builder — Build apps from natural language prompts', label: 'Site Description' },
      { key: 'contact_email', value: 'support@promptforgeai.dev', label: 'Contact Email' },
      { key: 'free_plan_limit', value: '3', label: 'Free Plan — Generation Limit' },
      { key: 'starter_plan_limit', value: '25', label: 'Starter Plan — Generation Limit' },
      { key: 'pro_plan_limit', value: '999', label: 'Pro Plan — Generation Limit' },
      { key: 'maintenance_mode', value: 'false', label: 'Maintenance Mode (true/false)' },
      { key: 'allow_registrations', value: 'true', label: 'Allow New Registrations (true/false)' },
    ];

    await this.prisma.siteSetting.createMany({ data: defaults, skipDuplicates: true });
  }
}
