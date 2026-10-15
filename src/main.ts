import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument, observeEnabled } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: observeEnabled ? ObserveInstrument : undefined,
  });

  const allowedOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:4173'
  ).split(',').map((origin) => origin.trim().replace(/\/+$/, '')).filter(Boolean);
  app.enableCors({ origin: allowedOrigins });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Javan API')
    .setDescription('Dokumentasi API backend Javan, termasuk endpoint Nationalize.')
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
