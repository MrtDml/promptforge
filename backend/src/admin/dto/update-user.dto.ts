import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum AdminPlanType {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
}

export enum AdminUserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(AdminPlanType)
  planType?: string;

  @IsOptional()
  @IsEnum(AdminUserRole)
  role?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  generationsLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  generationsUsed?: number;
}
