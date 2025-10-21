/**
 * Конфигурация приложения
 * 
 * Централизованная конфигурация для всего приложения включающая
 * настройки сервера, порты, окружение и общие константы.
 */

/**
 * Настройки сервера
 */
export const SERVER_CONFIG = {
  /** Порт по умолчанию для бекенда */
  PORT: 3002,
  /** Хост по умолчанию */
  HOST: 'localhost',
  /** Префикс для API */
  API_PREFIX: 'api',
} as const;

/**
 * Настройки окружения
 */
export const ENVIRONMENT = {
  /** Режим разработки */
  DEVELOPMENT: 'development',
  /** Продакшн режим */
  PRODUCTION: 'production',
  /** Тестовый режим */
  TEST: 'test',
} as const;

/**
 * Настройки CORS
 */
export const CORS_CONFIG = {
  /** Разрешенные origins */
  ORIGINS: ['http://localhost:3000', 'http://localhost:3001'],
  /** Разрешенные методы */
  METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  /** Разрешенные заголовки */
  HEADERS: ['Content-Type', 'Authorization', 'Accept'],
} as const;

/**
 * Настройки Swagger
 */
export const SWAGGER_CONFIG = {
  /** Заголовок API */
  TITLE: 'Products API',
  /** Описание API */
  DESCRIPTION: 'API для управления товарами',
  /** Версия API */
  VERSION: '1.0',
  /** Путь к документации */
  PATH: 'api',
} as const;

/**
 * Типы для конфигурации
 */
export type ServerConfig = typeof SERVER_CONFIG;
export type CorsConfig = typeof CORS_CONFIG;
export type SwaggerConfig = typeof SWAGGER_CONFIG;
