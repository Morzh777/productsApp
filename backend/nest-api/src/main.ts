import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS настройка
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Глобальная валидация с Zod
  app.useGlobalPipes(new ZodValidationPipe());

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Products API')
    .setDescription('API для управления товарами')
    .setVersion('1.0')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3002);
  console.log(`Приложение запущено на порту ${process.env.PORT ?? 3002}`);
  console.log(
    `Swagger документация: http://localhost:${process.env.PORT ?? 3002}/api`,
  );
}
bootstrap().catch((error) => {
  console.error('Ошибка при запуске приложения:', error);
  process.exit(1);
});
