import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          name: createUserDto.name,
          bio: createUserDto.bio ?? null,
        },
      });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Partial<{ name: string; bio: string; isActive: boolean }>) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        isActive: true,
        planType: true,
        generationsUsed: true,
        generationsLimit: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByPasswordResetToken(token: string) {
    return this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { gt: new Date() },
      },
    });
  }

  async setPasswordResetToken(id: string, token: string, expiry: Date) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });
  }

  async setEmailVerifyToken(id: string, token: string, expiry: Date) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerifyToken: token, emailVerifyExpiry: expiry },
    });
  }

  async findByEmailVerifyToken(token: string) {
    return this.prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpiry: { gt: new Date() },
      },
    });
  }

  async markEmailVerified(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpiry: null },
    });
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
