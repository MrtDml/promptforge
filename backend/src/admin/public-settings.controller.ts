import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Keys that are safe to expose publicly (announcement + branding only)
const PUBLIC_KEYS = new Set([
  'announcement_active',
  'announcement_message',
  'announcement_type',
  'announcement_link',
  'site_name',
]);

@Controller('settings/public')
export class PublicSettingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getPublicSettings() {
    const rows = await this.prisma.siteSetting.findMany({
      where: { key: { in: [...PUBLIC_KEYS] } },
    });

    // Return as a flat key→value map
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }
}
