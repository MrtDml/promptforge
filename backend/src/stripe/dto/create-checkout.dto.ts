import { IsIn, IsOptional } from 'class-validator';

export class CreateCheckoutDto {
  @IsIn(['starter', 'pro'], { message: 'planType must be either "starter" or "pro"' })
  planType: 'starter' | 'pro';

  @IsOptional()
  @IsIn(['monthly', 'annual'])
  billingCycle?: 'monthly' | 'annual';
}
