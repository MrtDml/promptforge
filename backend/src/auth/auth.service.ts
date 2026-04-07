import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { ReferralService } from '../referral/referral.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly referralService: ReferralService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, bio, referralCode } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await this.usersService.create({ email, password: hashedPassword, name, bio });

    this.logger.log(`New user registered: ${email}`);
    this.notifyNewUser(email, name ?? 'Adsız', 'Form');

    // Apply referral code if provided (silently ignore invalid codes)
    if (referralCode) {
      this.referralService.applyReferralCode(user.id, referralCode).catch((err) =>
        this.logger.warn(`Referral code "${referralCode}" invalid: ${err.message}`),
      );
    }

    // Send verification email
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await this.usersService.setEmailVerifyToken(user.id, verifyToken, verifyExpiry);
    this.mailService.sendVerificationEmail(email, name, verifyToken).catch((err) =>
      this.logger.error(`Failed to send verification email: ${err.message}`),
    );

    const token = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    const { password: _password, ...userWithoutPassword } = user;
    return {
      user: { ...userWithoutPassword, plan: userWithoutPassword.planType ?? 'free' },
      token,
      refreshToken,
      emailVerificationSent: true,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated. Please contact support.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    this.logger.log(`User logged in: ${email}`);

    const token = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    const { password: _password, ...userWithoutPassword } = user;
    return {
      user: { ...userWithoutPassword, plan: userWithoutPassword.planType ?? 'free' },
      token,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ token: string }> {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      }) as { sub: string; email: string; type: string };

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const token = this.generateToken(user.id, user.email);
      return { token };
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, plan: userWithoutPassword.planType ?? 'free' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;
    const user = await this.usersService.findByEmail(email);

    // Always return success to prevent user enumeration
    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersService.setPasswordResetToken(user.id, token, expiry);

    this.logger.log(`Password reset requested for ${email}`);

    // Send reset email
    this.mailService.sendPasswordResetEmail(email, user.name, token).catch((err) =>
      this.logger.error(`Failed to send password reset email: ${err.message}`),
    );

    return {
      message: 'If an account with that email exists, a reset link has been sent.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByEmailVerifyToken(token);
    if (!user) {
      throw new BadRequestException('Verification link is invalid or has expired.');
    }
    await this.usersService.markEmailVerified(user.id);
    // Send welcome email after verification
    this.mailService.sendWelcomeEmail(user.email, user.name).catch((err) =>
      this.logger.error(`Failed to send welcome email: ${err.message}`),
    );
    return { message: 'Email verified successfully. Welcome to PromptForge!' };
  }

  async oauthLogin(profile: { email: string; name: string; provider: string }) {
    const { email, name, provider } = profile;
    if (!email) {
      throw new BadRequestException(`${provider} account has no public email. Please set a public email on ${provider} and try again.`);
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Auto-register via OAuth — no password needed
      const placeholder = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), BCRYPT_SALT_ROUNDS);
      user = await this.usersService.create({ email, password: placeholder, name });
      // Mark email as verified (OAuth provider already verified it)
      await this.usersService.markEmailVerified(user.id);
      this.mailService.sendWelcomeEmail(email, name).catch(() => {});
      this.logger.log(`New user via ${provider} OAuth: ${email}`);
      this.notifyNewUser(email, name ?? 'Adsız', provider);
    } else if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Please contact support.');
    } else if (name && (!user.name || user.name === 'User')) {
      await this.usersService.update(user.id, { name });
    }

    const token = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);
    return { token, refreshToken };
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.emailVerified) {
      return { message: 'Email is already verified.' };
    }
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.usersService.setEmailVerifyToken(user.id, verifyToken, verifyExpiry);
    this.mailService.sendVerificationEmail(user.email, user.name, verifyToken).catch((err) =>
      this.logger.error(`Failed to resend verification email: ${err.message}`),
    );
    return { message: 'Verification email sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    const user = await this.usersService.findByPasswordResetToken(token);
    if (!user) {
      throw new BadRequestException('Reset token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await this.usersService.updatePassword(user.id, hashedPassword);

    this.logger.log(`Password reset completed for ${user.email}`);
    return { message: 'Password updated successfully. You can now log in.' };
  }

  private notifyNewUser(email: string, name: string, source: string): void {
    const url = process.env.N8N_NEW_USER_WEBHOOK_URL;
    if (!url) return;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, source }),
    }).catch(() => { /* fire and forget */ });
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email, type: 'access' };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(userId: string, email: string): string {
    const payload = { sub: userId, email, type: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }
}
