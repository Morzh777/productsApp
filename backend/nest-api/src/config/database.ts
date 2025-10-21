/**
 * Конфигурация базы данных и Prisma
 * 
 * Централизованная конфигурация для работы с базой данных включающая
 * настройки подключения, retry логику и конфигурацию Prisma.
 */

/**
 * Настройки подключения к базе данных
 */
export const DATABASE_CONFIG = {
  /** Максимальное количество попыток подключения */
  MAX_RETRIES: 3,
  /** Задержки между попытками в миллисекундах */
  RETRY_DELAYS: [500, 1000, 2000], // 500ms, 1s, 2s
  /** Коды ошибок Prisma для retry */
  RETRY_ERROR_CODES: ['P2024', 'P1001', 'P1008'] as const,
  /** Ключевые слова в сообщениях об ошибках для retry */
  RETRY_ERROR_KEYWORDS: ['Closed', 'connection', 'timeout'] as const,
} as const;

/**
 * Настройки логирования Prisma
 */
export const PRISMA_LOG_LEVELS = {
  /** Логирование запросов */
  QUERY: 'query',
  /** Информационные сообщения */
  INFO: 'info',
  /** Предупреждения */
  WARN: 'warn',
  /** Ошибки */
  ERROR: 'error',
} as const;

/**
 * Конфигурация Prisma клиента
 */
export const PRISMA_CONFIG = {
  /** Формат ошибок */
  ERROR_FORMAT: 'pretty',
  /** Уровни логирования */
  LOG_LEVELS: [
    PRISMA_LOG_LEVELS.QUERY,
    PRISMA_LOG_LEVELS.INFO,
    PRISMA_LOG_LEVELS.WARN,
    PRISMA_LOG_LEVELS.ERROR,
  ],
} as const;

/**
 * Типы для конфигурации базы данных
 */
export type DatabaseConfig = typeof DATABASE_CONFIG;
export type PrismaConfig = typeof PRISMA_CONFIG;
