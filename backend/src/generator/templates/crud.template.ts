import { ParsedEntity, ParsedField } from '../../parser/dto/parse-prompt.dto';

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function getTypeScriptType(type: string): string {
  const map: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    date: 'Date',
  };
  return map[type] || 'string';
}

function generateDtoField(field: ParsedField): string {
  const tsType = getTypeScriptType(field.type);
  const isOptional = field.required === false;
  const decorators: string[] = [];

  if (isOptional) {
    decorators.push('  @IsOptional()');
  }

  switch (field.type) {
    case 'string':
      decorators.push('  @IsString()');
      break;
    case 'number':
      decorators.push('  @IsNumber()');
      break;
    case 'boolean':
      decorators.push('  @IsBoolean()');
      break;
    case 'date':
      decorators.push('  @IsDateString()');
      break;
  }

  if (field.unique) {
    decorators.push('  // @IsUnique() — enforce uniqueness at the service layer');
  }

  const optionalMark = isOptional ? '?' : '';
  return `${decorators.join('\n')}\n  ${field.name}${optionalMark}: ${tsType};`;
}

function generateCreateDto(entity: ParsedEntity): string {
  const entityName = toPascalCase(entity.name);
  // Filter out auto-managed fields
  const userFields = entity.fields.filter(
    (f) => !['id', 'createdAt', 'updatedAt'].includes(f.name),
  );

  const fieldLines = userFields.map(generateDtoField).join('\n\n');

  const imports = new Set<string>(['IsString', 'IsOptional']);
  for (const field of userFields) {
    if (field.required === false) imports.add('IsOptional');
    switch (field.type) {
      case 'string': imports.add('IsString'); break;
      case 'number': imports.add('IsNumber'); break;
      case 'boolean': imports.add('IsBoolean'); break;
      case 'date': imports.add('IsDateString'); break;
    }
  }

  return `import { ${[...imports].join(', ')} } from 'class-validator';

export class Create${entityName}Dto {
${fieldLines}
}

export class Update${entityName}Dto {
${userFields
    .map((f) => {
      const tsType = getTypeScriptType(f.type);
      return `  @IsOptional()\n  ${f.name}?: ${tsType};`;
    })
    .join('\n\n')}
}
`;
}

function generateService(entity: ParsedEntity): string {
  const entityName = toPascalCase(entity.name);
  const varName = toCamelCase(entity.name);
  const prismaModel = toCamelCase(entity.name);

  return `import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Create${entityName}Dto, Update${entityName}Dto } from './dto/create-${toKebabCase(entityName)}.dto';

@Injectable()
export class ${entityName}Service {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(${entityName}Service.name);

  async create(create${entityName}Dto: Create${entityName}Dto) {
    const ${varName} = await this.prisma.${prismaModel}.create({
      data: create${entityName}Dto,
    });
    this.logger.log(\`Created ${entityName}: \${${varName}.id}\`);
    return ${varName};
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.${prismaModel}.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.${prismaModel}.count(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const ${varName} = await this.prisma.${prismaModel}.findUnique({
      where: { id },
    });
    if (!${varName}) {
      throw new NotFoundException(\`${entityName} with ID \${id} not found\`);
    }
    return ${varName};
  }

  async update(id: string, update${entityName}Dto: Update${entityName}Dto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.${prismaModel}.update({
      where: { id },
      data: update${entityName}Dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    await this.prisma.${prismaModel}.delete({ where: { id } });
    return { message: '${entityName} deleted successfully' };
  }
}
`;
}

function generateController(entity: ParsedEntity): string {
  const entityName = toPascalCase(entity.name);
  const varName = toCamelCase(entity.name);
  const routePath = toKebabCase(entityName) + 's';

  return `import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ${entityName}Service } from './${toKebabCase(entityName)}.service';
import { Create${entityName}Dto, Update${entityName}Dto } from './dto/create-${toKebabCase(entityName)}.dto';

@Controller('${routePath}')
@UseGuards(JwtAuthGuard)
export class ${entityName}Controller {
  constructor(private readonly ${varName}Service: ${entityName}Service) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() create${entityName}Dto: Create${entityName}Dto) {
    return this.${varName}Service.create(create${entityName}Dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.${varName}Service.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${varName}Service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() update${entityName}Dto: Update${entityName}Dto,
  ) {
    return this.${varName}Service.update(id, update${entityName}Dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.${varName}Service.remove(id);
  }
}
`;
}

export interface GeneratedCrudFiles {
  entityName: string;
  dtoFile: { name: string; content: string };
  serviceFile: { name: string; content: string };
  controllerFile: { name: string; content: string };
}

export function generateCrudFiles(entity: ParsedEntity): GeneratedCrudFiles {
  const entityName = toPascalCase(entity.name);
  const kebab = toKebabCase(entityName);

  return {
    entityName,
    dtoFile: {
      name: `dto/create-${kebab}.dto.ts`,
      content: generateCreateDto(entity),
    },
    serviceFile: {
      name: `${kebab}.service.ts`,
      content: generateService(entity),
    },
    controllerFile: {
      name: `${kebab}.controller.ts`,
      content: generateController(entity),
    },
  };
}
