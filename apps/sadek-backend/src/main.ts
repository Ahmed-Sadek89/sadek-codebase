import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { INestApplication } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from './app.module';
import { setupSwagger } from '../lib/SwaggerConfig';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors({
    origin: config
      .getOrThrow<string>('FRONTEND_URL')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties that do not have any decorators in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present in the request
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // Allow automatic type conversion based on TypeScript types (e.g., string to number)
      },
    }),
  );
  setupSwagger(app);
  return app;
}

async function bootstrap() {
  const app = await createApp();
  await app.listen(Number(process.env.PORT ?? 4000));
}

let applicationPromise: Promise<INestApplication> | undefined;

async function getApplication(): Promise<INestApplication> {
  if (!applicationPromise) {
    applicationPromise = (async () => {
      const app = await createApp();
      await app.init();
      return app;
    })().catch((error: unknown) => {
      applicationPromise = undefined;
      throw error;
    });
  }
  return applicationPromise;
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const app = await getApplication();
  app.getHttpAdapter().getInstance()(request, response);
}

if (require.main === module) {
  void bootstrap();
}
