import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DeployService } from './deploy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('deploy')
@UseGuards(JwtAuthGuard)
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  /**
   * POST /api/v1/deploy/:projectId
   * Triggers a Railway deployment for the given project.
   * The authenticated user must own the project.
   */
  @Post(':projectId')
  @HttpCode(HttpStatus.OK)
  async deploy(@Param('projectId') projectId: string, @Request() req: any) {
    const result = await this.deployService.deployToRailway(projectId, req.user.id);
    return {
      success: true,
      message: 'Deployment initiated successfully',
      data: result,
    };
  }

  /**
   * GET /api/v1/deploy/:projectId/status
   * Returns the current deployment status for the given project.
   * Fetches live data from Railway when a railwayProjectId is available.
   */
  @Get(':projectId/status')
  @HttpCode(HttpStatus.OK)
  async getStatus(@Param('projectId') projectId: string, @Request() req: any) {
    const result = await this.deployService.getDeployStatus(projectId, req.user.id);
    return {
      success: true,
      data: result,
    };
  }
}
