import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AutomationApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const key = req.headers['x-automation-key'];
    const expected = process.env.AUTOMATION_API_KEY;

    if (!expected) {
      throw new UnauthorizedException('AUTOMATION_API_KEY is not configured');
    }
    if (!key || key !== expected) {
      throw new UnauthorizedException('Invalid automation API key');
    }
    return true;
  }
}
