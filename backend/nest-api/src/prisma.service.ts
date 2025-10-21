import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DATABASE_CONFIG } from './config/database';
import { PRISMA_CONFIG } from './config/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: [...PRISMA_CONFIG.LOG_LEVELS],
      errorFormat: PRISMA_CONFIG.ERROR_FORMAT,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Метод для безопасного выполнения запросов с retry
   */
  async safeQuery<T>(
    query: () => Promise<T>,
    retries = DATABASE_CONFIG.MAX_RETRIES,
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        // Проверяем соединение перед запросом
        await this.$queryRaw`SELECT 1`;
        return await query();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);

        // Обрабатываем различные типы ошибок соединения
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          (DATABASE_CONFIG.RETRY_ERROR_CODES.includes(
            error.code as (typeof DATABASE_CONFIG.RETRY_ERROR_CODES)[number],
          ) ||
            DATABASE_CONFIG.RETRY_ERROR_KEYWORDS.some((keyword) =>
              errorMessage.includes(keyword),
            )) &&
          i < retries - 1
        ) {
          console.log(
            `Повтор ${i + 1}/${retries} для запроса к базе данных (${errorMessage})`,
          );

          // Переподключаемся к базе данных
          try {
            await this.$disconnect();
            await this.$connect();
            console.log('База данных переподключена');
          } catch {
            console.log('Не удалось переподключиться к базе данных');
          }

          // Используем настроенные задержки
          await new Promise((resolve) =>
            setTimeout(resolve, DATABASE_CONFIG.RETRY_DELAYS[i]),
          );
          continue;
        }
        throw error;
      }
    }
    throw new Error('Превышено максимальное количество попыток');
  }
}
