import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

export interface DeployResult {
  deployUrl: string;
  railwayProjectId: string;
  status: string;
}

interface RailwayGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: unknown[]; path?: string[] }>;
}

@Injectable()
export class DeployService {
  private readonly logger = new Logger(DeployService.name);
  private readonly prisma = new PrismaClient();
  private readonly railwayApiUrl = 'https://backboard.railway.app/graphql/v2';

  constructor(private readonly configService: ConfigService) {}

  private get railwayToken(): string {
    const token = this.configService.get<string>('RAILWAY_API_TOKEN');
    if (!token || token === 'your_railway_token_here') {
      throw new InternalServerErrorException(
        'RAILWAY_API_TOKEN is not configured. Please set it in your environment variables.',
      );
    }
    return token;
  }

  /**
   * Sends a GraphQL request to the Railway API.
   * Uses the global fetch available in Node 18+.
   */
  private async railwayGraphQL<T>(
    query: string,
    variables: Record<string, unknown> = {},
  ): Promise<T> {
    const token = this.railwayToken;

    let response: Response;
    try {
      response = await fetch(this.railwayApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
    } catch (networkError: any) {
      this.logger.error(
        `Railway API network error: ${networkError.message}`,
        networkError.stack,
      );
      throw new InternalServerErrorException(
        `Failed to reach Railway API: ${networkError.message}`,
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => response.statusText);
      throw new InternalServerErrorException(
        `Railway API HTTP ${response.status}: ${body}`,
      );
    }

    const body: RailwayGraphQLResponse<T> = await response.json();

    if (body.errors && body.errors.length > 0) {
      const messages = body.errors.map((e) => e.message).join('; ');
      throw new InternalServerErrorException(`Railway API error: ${messages}`);
    }

    if (!body.data) {
      throw new InternalServerErrorException(
        'Railway API returned an empty response.',
      );
    }

    return body.data;
  }

  /**
   * Deploys a PromptForge project to Railway.
   *
   * Steps:
   *  1. Validate project exists and is owned by the user.
   *  2. Create a new Railway project.
   *  3. Fetch the default environment (production).
   *  4. Create a PostgreSQL service with required env vars.
   *  5. Create the app service with env vars pointing to Postgres.
   *  6. Generate a public domain for the app service.
   *  7. Persist all Railway metadata back to the PromptForge project.
   */
  async deployToRailway(projectId: string, userId: string): Promise<DeployResult> {
    // ── 1. Validate project ownership ────────────────────────────────────────
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    if (project.status !== 'COMPLETED') {
      throw new BadRequestException(
        'Only completed projects can be deployed. Please wait for generation to finish.',
      );
    }

    // ── 2. Create Railway project ─────────────────────────────────────────────
    this.logger.log(`Creating Railway project for PromptForge project ${projectId}`);

    const appSlug = (project.appName ?? project.name)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);

    const railwayProjectName = `promptforge-${appSlug}-${Date.now().toString(36)}`;

    const createProjectData = await this.railwayGraphQL<{
      projectCreate: { id: string; name: string };
    }>(
      `mutation ProjectCreate($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
          id
          name
        }
      }`,
      {
        input: {
          name: railwayProjectName,
          description: `Deployed from PromptForge — project: ${project.name}`,
        },
      },
    );

    const railwayProjectId = createProjectData.projectCreate.id;
    this.logger.log(`Railway project created: ${railwayProjectId}`);

    // Immediately mark the project as deploying in the DB so the UI updates
    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        deployStatus: 'deploying',
        railwayProjectId,
        lastDeployAt: new Date(),
      },
    });

    try {
      // ── 3. Fetch the default environment ─────────────────────────────────────
      const envData = await this.railwayGraphQL<{
        project: {
          environments: {
            edges: Array<{ node: { id: string; name: string } }>;
          };
        };
      }>(
        `query ProjectEnvironments($id: String!) {
          project(id: $id) {
            environments {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }`,
        { id: railwayProjectId },
      );

      const environments = envData.project.environments.edges;
      const defaultEnv =
        environments.find((e) => e.node.name === 'production') ??
        environments[0];

      if (!defaultEnv) {
        throw new InternalServerErrorException(
          'No environments found in the Railway project.',
        );
      }

      const environmentId = defaultEnv.node.id;
      this.logger.log(`Using Railway environment: ${environmentId}`);

      // ── 4. Create PostgreSQL service ──────────────────────────────────────────
      this.logger.log('Creating PostgreSQL service in Railway project');

      const postgresData = await this.railwayGraphQL<{
        serviceCreate: { id: string; name: string };
      }>(
        `mutation ServiceCreate($input: ServiceCreateInput!) {
          serviceCreate(input: $input) {
            id
            name
          }
        }`,
        {
          input: {
            projectId: railwayProjectId,
            name: 'postgres',
            source: { image: 'postgres:15-alpine' },
          },
        },
      );

      const postgresServiceId = postgresData.serviceCreate.id;
      this.logger.log(`PostgreSQL service created: ${postgresServiceId}`);

      // Configure PostgreSQL environment variables
      await this.railwayGraphQL(
        `mutation VariableCollectionUpsert($input: VariableCollectionUpsertInput!) {
          variableCollectionUpsert(input: $input)
        }`,
        {
          input: {
            projectId: railwayProjectId,
            environmentId,
            serviceId: postgresServiceId,
            variables: {
              POSTGRES_USER: 'promptforge',
              POSTGRES_PASSWORD: 'promptforge_secret',
              POSTGRES_DB: appSlug,
            },
          },
        },
      );

      // ── 5. Create the app service ─────────────────────────────────────────────
      this.logger.log('Creating app service in Railway project');

      const appServiceData = await this.railwayGraphQL<{
        serviceCreate: { id: string; name: string };
      }>(
        `mutation ServiceCreate($input: ServiceCreateInput!) {
          serviceCreate(input: $input) {
            id
            name
          }
        }`,
        {
          input: {
            projectId: railwayProjectId,
            name: appSlug,
            // Uses a minimal Node image as a placeholder; users can connect
            // their own GitHub repo in the Railway dashboard to deploy the
            // generated NestJS application code.
            source: { image: 'node:20-alpine' },
          },
        },
      );

      const appServiceId = appServiceData.serviceCreate.id;
      this.logger.log(`App service created: ${appServiceId}`);

      // Configure app environment variables
      const databaseUrl = `postgresql://promptforge:promptforge_secret@postgres.railway.internal:5432/${appSlug}`;
      await this.railwayGraphQL(
        `mutation VariableCollectionUpsert($input: VariableCollectionUpsertInput!) {
          variableCollectionUpsert(input: $input)
        }`,
        {
          input: {
            projectId: railwayProjectId,
            environmentId,
            serviceId: appServiceId,
            variables: {
              NODE_ENV: 'production',
              PORT: '3000',
              DATABASE_URL: databaseUrl,
              APP_NAME: project.appName ?? project.name,
            },
          },
        },
      );

      // ── 6. Generate a public domain ───────────────────────────────────────────
      let deployUrl = `https://${appSlug}.up.railway.app`;

      try {
        const domainData = await this.railwayGraphQL<{
          serviceDomainCreate: { domain: string };
        }>(
          `mutation ServiceDomainCreate($input: ServiceDomainCreateInput!) {
            serviceDomainCreate(input: $input) {
              domain
            }
          }`,
          {
            input: {
              serviceId: appServiceId,
              environmentId,
            },
          },
        );
        deployUrl = `https://${domainData.serviceDomainCreate.domain}`;
        this.logger.log(`Domain created: ${deployUrl}`);
      } catch (domainError: any) {
        this.logger.warn(
          `Could not create custom domain, using default URL: ${domainError.message}`,
        );
      }

      // ── 7. Persist final metadata to DB ──────────────────────────────────────
      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          deployStatus: 'deployed',
          deployUrl,
          railwayProjectId,
          deployedAt: new Date(),
          lastDeployAt: new Date(),
        },
      });

      this.logger.log(
        `Project ${projectId} deployed successfully to Railway: ${deployUrl}`,
      );

      return {
        deployUrl,
        railwayProjectId,
        status: 'deployed',
      };
    } catch (error: any) {
      // Record the failure in the DB so the UI shows the correct state
      await this.prisma.project.update({
        where: { id: projectId },
        data: { deployStatus: 'failed' },
      });
      throw error;
    }
  }

  /**
   * Returns the current deployment status for a project.
   * When a railwayProjectId is stored, it queries the Railway API for the
   * live status of the latest deployment and syncs changes back to the DB.
   */
  async getDeployStatus(
    projectId: string,
    userId: string,
  ): Promise<{ status: string; url?: string; railwayProjectId?: string }> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    // No Railway project yet — return stored status
    if (!project.railwayProjectId) {
      return {
        status: project.deployStatus ?? 'not_deployed',
        url: project.deployUrl ?? undefined,
      };
    }

    // Query Railway for the live deployment status
    try {
      const data = await this.railwayGraphQL<{
        project: {
          id: string;
          services: {
            edges: Array<{
              node: {
                id: string;
                name: string;
                serviceInstances: {
                  edges: Array<{
                    node: {
                      latestDeployment?: {
                        id: string;
                        status: string;
                        url?: string;
                      };
                    };
                  }>;
                };
              };
            }>;
          };
        };
      }>(
        `query ProjectStatus($id: String!) {
          project(id: $id) {
            id
            services {
              edges {
                node {
                  id
                  name
                  serviceInstances {
                    edges {
                      node {
                        latestDeployment {
                          id
                          status
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
        { id: project.railwayProjectId },
      );

      const services = data.project.services.edges;
      // The app service is the one that is not "postgres"
      const appService =
        services.find((s) => s.node.name !== 'postgres') ?? services[0];

      if (!appService) {
        return {
          status: project.deployStatus ?? 'deploying',
          url: project.deployUrl ?? undefined,
          railwayProjectId: project.railwayProjectId,
        };
      }

      const instances = appService.node.serviceInstances.edges;
      const latestDeployment = instances[0]?.node?.latestDeployment;

      // Map Railway deployment status codes to our four statuses
      const railwayStatus = latestDeployment?.status ?? 'BUILDING';
      let mappedStatus: string;
      switch (railwayStatus) {
        case 'SUCCESS':
          mappedStatus = 'deployed';
          break;
        case 'FAILED':
        case 'CRASHED':
          mappedStatus = 'failed';
          break;
        case 'BUILDING':
        case 'DEPLOYING':
        case 'INITIALIZING':
        case 'WAITING':
          mappedStatus = 'deploying';
          break;
        default:
          mappedStatus = project.deployStatus ?? 'deploying';
      }

      const liveUrl = latestDeployment?.url
        ? `https://${latestDeployment.url}`
        : project.deployUrl ?? undefined;

      // Sync status and URL back to DB if changed
      const statusChanged = mappedStatus !== project.deployStatus;
      const urlChanged = liveUrl && liveUrl !== project.deployUrl;
      if (statusChanged || urlChanged) {
        await this.prisma.project.update({
          where: { id: projectId },
          data: {
            deployStatus: mappedStatus,
            ...(liveUrl ? { deployUrl: liveUrl } : {}),
            ...(mappedStatus === 'deployed' && !project.deployedAt
              ? { deployedAt: new Date() }
              : {}),
          },
        });
      }

      return {
        status: mappedStatus,
        url: liveUrl,
        railwayProjectId: project.railwayProjectId,
      };
    } catch (error: any) {
      this.logger.warn(
        `Could not fetch live Railway status for project ${projectId}: ${error.message}`,
      );
      // Fall back to whatever is persisted in the DB
      return {
        status: project.deployStatus ?? 'not_deployed',
        url: project.deployUrl ?? undefined,
        railwayProjectId: project.railwayProjectId,
      };
    }
  }
}
