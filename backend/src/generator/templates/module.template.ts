import { ParsedEntity } from '../../parser/dto/parse-prompt.dto';

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generates the root app.module.ts that imports every entity module plus
 * the ConfigModule, ThrottlerModule, and optionally the AuthModule.
 */
export function generateAppModule(
  entities: ParsedEntity[],
  hasAuth: boolean,
): string {
  const entityImports = entities
    .map((e) => {
      const pascal = toPascalCase(e.name);
      const kebab = toKebabCase(pascal);
      return `import { ${pascal}Module } from './${kebab}/${kebab}.module';`;
    })
    .join('\n');

  const entityModuleList = entities
    .map((e) => `${toPascalCase(e.name)}Module`)
    .join(',\n    ');

  const authImport = hasAuth
    ? `import { AuthModule } from './auth/auth.module';`
    : '';

  const authModuleEntry = hasAuth ? 'AuthModule,' : '';

  return `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
${authImport}
${entityImports}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ${authModuleEntry}
    ${entityModuleList},
  ],
})
export class AppModule {}
`;
}

/**
 * Generates a NestJS module file for a single entity, wiring together its
 * controller, service, and the shared PrismaClient.
 */
export function generateEntityModule(entityName: string): string {
  const pascal = toPascalCase(entityName);
  const kebab = toKebabCase(pascal);

  return `import { Module } from '@nestjs/common';
import { ${pascal}Controller } from './${kebab}.controller';
import { ${pascal}Service } from './${kebab}.service';

@Module({
  controllers: [${pascal}Controller],
  providers: [${pascal}Service],
  exports: [${pascal}Service],
})
export class ${pascal}Module {}
`;
}
