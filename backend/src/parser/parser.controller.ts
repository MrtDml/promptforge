import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParsePromptDto } from './dto/parse-prompt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('parser')
@UseGuards(JwtAuthGuard)
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Post('parse')
  @HttpCode(HttpStatus.OK)
  async parsePrompt(@Body() parsePromptDto: ParsePromptDto) {
    const result = await this.parserService.parsePrompt(parsePromptDto);

    // Build CRUD endpoints for each entity
    const endpoints: Array<{
      method: string;
      path: string;
      description: string;
      auth: boolean;
    }> = [];

    if (result.features.includes('auth')) {
      endpoints.push(
        { method: 'POST', path: '/auth/register', description: 'Register new user', auth: false },
        {
          method: 'POST',
          path: '/auth/login',
          description: 'Login and receive token',
          auth: false,
        },
        { method: 'GET', path: '/auth/me', description: 'Get current user profile', auth: true },
      );
    }

    for (const entity of result.entities) {
      const base = `/${entity.name.toLowerCase()}s`;
      endpoints.push(
        { method: 'GET', path: base, description: `List all ${entity.name}s`, auth: true },
        { method: 'POST', path: base, description: `Create a ${entity.name}`, auth: true },
        { method: 'GET', path: `${base}/:id`, description: `Get ${entity.name} by ID`, auth: true },
        { method: 'PATCH', path: `${base}/:id`, description: `Update ${entity.name}`, auth: true },
        { method: 'DELETE', path: `${base}/:id`, description: `Delete ${entity.name}`, auth: true },
      );
    }

    // Transform ParsedSchema → AppSchema (frontend-compatible format)
    const schema = {
      appName: result.app_name,
      description: result.description ?? `A ${result.app_name} application`,
      entities: result.entities.map((e) => ({
        name: e.name,
        fields: e.fields.map((f) => ({
          name: f.name,
          type: f.type,
          required: f.required ?? false,
          unique: f.unique ?? false,
        })),
        timestamps: true,
      })),
      endpoints,
      features: result.features as string[],
      techStack: {
        backend: 'NestJS',
        database: 'PostgreSQL',
        auth: 'JWT',
        frontend: 'Next.js',
      },
      rawPrompt: parsePromptDto.prompt,
      // Keep raw parsed data for the generator
      _parsed: result,
    };

    return {
      schema,
      confidence: 0.9,
      suggestions: [] as string[],
    };
  }
}
