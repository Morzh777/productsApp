import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SERVER_CONFIG } from './config/app';
import { CORS_CONFIG } from './config/app';
import { SWAGGER_CONFIG } from './config/app';
import { SWAGGER_ROUTES } from './config/routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS настройка
  app.enableCors({
    origin: CORS_CONFIG.ORIGINS,
    methods: CORS_CONFIG.METHODS,
    allowedHeaders: CORS_CONFIG.HEADERS,
  });

  // Глобальная валидация с Zod
  app.useGlobalPipes(new ZodValidationPipe());

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.TITLE)
    .setDescription(SWAGGER_CONFIG.DESCRIPTION)
    .setVersion(SWAGGER_CONFIG.VERSION)
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_ROUTES.MAIN, app, document);

  const port = process.env.PORT ?? SERVER_CONFIG.PORT;
  await app.listen(port);
  console.log(`Приложение запущено на порту ${port}`);
  console.log(
    `Swagger документация: http://localhost:${port}${SWAGGER_ROUTES.MAIN}`,
  );
}
bootstrap().catch((error) => {
  console.error('Ошибка при запуске приложения:', error);
  process.exit(1);
});
