import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getPublishedPosts() {
    return this.prisma.blogPost.findMany({
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
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }
}
