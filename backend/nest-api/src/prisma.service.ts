import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
      log: ['query', 'info', 'warn', 'error'],
      // Настройки для предотвращения падения при высокой нагрузке
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Метод для безопасного выполнения запросов с retry
  async safeQuery<T>(query: () => Promise<T>, retries = 2): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await query();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);

        // Обрабатываем различные типы ошибок соединения
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          (error.code === 'P2024' || // Connection pool timeout
            error.code === 'P1001' || // Can't reach database server
            error.code === 'P1008' || // Operations timed out
            errorMessage.includes('Closed') ||
            errorMessage.includes('connection') ||
            errorMessage.includes('timeout')) &&
          i < retries - 1
        ) {
          console.log(
            `🔄 Retry ${i + 1}/${retries} for database query (${errorMessage})`,
          );
          // Уменьшенные задержки: 200ms, 500ms
          await new Promise((resolve) =>
            setTimeout(resolve, 200 * Math.pow(2.5, i)),
          );
          continue;
        }
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }
}
