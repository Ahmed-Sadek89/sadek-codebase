import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Serves Swagger UI at /api-docs and the OpenAPI spec at /openapi.json (imported by Apidog).
// Off in production unless SWAGGER_ENABLED=true, so the API shape is not public by default.
export function setupSwagger(app: INestApplication): void {
  const enabled =
    process.env.SWAGGER_ENABLED === 'true' ||
    (process.env.SWAGGER_ENABLED !== 'false' && process.env.NODE_ENV !== 'production');
  if (!enabled) return;

  const builder = new DocumentBuilder()
    .setTitle('Sadek Portfolio API')
    .setDescription('Backend API for the Sadek portfolio dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    // Listed servers become selectable base URLs in Swagger UI and Apidog.
    .addServer(`http://localhost:${process.env.PORT ?? 4000}`, 'Local');
  if (process.env.PRODUCTION_API_URL) {
    builder.addServer(process.env.PRODUCTION_API_URL, 'Production');
  }

  const document = SwaggerModule.createDocument(app, builder.build());
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'openapi.json',
    swaggerOptions: { persistAuthorization: true },
  });
}
