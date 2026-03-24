import { IsIn } from 'class-validator';

export class CreateCheckoutDto {
  @IsIn(['starter', 'pro'], { message: 'planType must be either "starter" or "pro"' })
  planType: 'starter' | 'pro';
}
