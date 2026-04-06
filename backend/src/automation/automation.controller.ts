import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { AutomationApiKeyGuard } from './automation-api-key.guard';
import { AutomationService } from './automation.service';

@Controller('automation')
@UseGuards(AutomationApiKeyGuard)
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  /**
   * GET /api/v1/automation/stats
   * Daily KPI report — new users, projects, plan breakdown
   * n8n: Cron (daily 09:00) → HTTP GET → Telegram/Email
   */
  @Get('stats')
  getStats() {
    return this.automationService.getStats();
  }

  /**
   * GET /api/v1/automation/inactive
   * Users registered 14+ days ago with 0 projects
   * n8n: Cron (daily) → HTTP GET → send re-engagement email per user
   */
  @Get('inactive')
  getInactiveUsers() {
    return this.automationService.getInactiveUsers();
  }

  /**
   * GET /api/v1/automation/expiring
   * Active subscriptions expiring within 3 days
   * n8n: Cron (daily) → HTTP GET → send renewal reminder email
   */
  @Get('expiring')
  getExpiringSubscriptions() {
    return this.automationService.getExpiringSubscriptions();
  }

  /**
   * GET /api/v1/automation/drip?day=1|3|7
   * Drip campaign targets by registration day window
   * n8n: Cron (hourly) → HTTP GET → send drip email per user
   *   day=1: registered 20-28h ago → welcome tutorial mail
   *   day=3: registered 3 days ago, 0 projects → "are you stuck?" mail
   *   day=7: registered 7 days ago, free plan → upgrade CTA mail
   */
  @Get('drip')
  async getDripTargets(@Query('day', ParseIntPipe) day: number) {
    if (day !== 1 && day !== 3 && day !== 7) {
      throw new BadRequestException('day must be 1, 3, or 7');
    }
    return this.automationService.getDripTargets(day as 1 | 3 | 7);
  }
}
