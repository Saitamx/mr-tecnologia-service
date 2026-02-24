import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MR Tecnología API')
    .setDescription('API para el sistema de gestión de MR Tecnología')
    .setVersion('1.0')
    .addTag('products', 'Gestión de productos')
    .addTag('categories', 'Gestión de categorías')
    .addTag('auth', 'Autenticación')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Permitir múltiples orígenes para desarrollo y producción
  const allowedOrigins = [
    'http://localhost:3000', // Frontend web
    'http://localhost:3001', // Backoffice
    'http://192.168.0.2:3000',
    'http://192.168.0.2:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://mr-tecnologia-front-web.vercel.app', // Frontend web producción
    'https://mr-tecnologia-front-backoffice.vercel.app', // Backoffice producción
  ];
  
  // Agregar orígenes adicionales desde variables de entorno
  const corsOrigin = process.env.CORS_ORIGIN;
  if (corsOrigin) {
    const origins = corsOrigin.split(',').map(o => o.trim());
    allowedOrigins.push(...origins);
  }
  
  console.log('🌐 CORS allowed origins:', allowedOrigins);
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        console.log('⚠️ Request without origin - allowing in development');
        callback(null, true);
        return;
      }
      
      const normalizedOrigin = origin.replace(/\/$/, '');
      
      if (allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked origin: ${origin}`);
        console.log('Allowed origins:', allowedOrigins);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  });

  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
