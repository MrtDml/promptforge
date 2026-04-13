import { Controller, Get, Param, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Get()
  async getPublishedPosts() {
    const CACHE_KEY = 'blog:published';
    const cached = await this.cache.get(CACHE_KEY);
    if (cached) return cached;

    const posts = await this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        readTime: true,
        createdAt: true,
      },
    });

    await this.cache.set(CACHE_KEY, posts, 300_000); // 5 dakika
    return posts;
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    const CACHE_KEY = `blog:post:${slug}`;
    const cached = await this.cache.get(CACHE_KEY);
    if (cached) return cached;

    const post = await this.prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');

    await this.cache.set(CACHE_KEY, post, 300_000); // 5 dakika
    return post;
  }
}
