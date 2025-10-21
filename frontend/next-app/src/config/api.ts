/**
 * Конфигурация HTTP методов и настроек API
 * 
 * Централизованная конфигурация для работы с API включающая HTTP методы,
 * заголовки, MIME типы, настройки кеширования и таймауты. Предоставляет
 * типизированные константы для безопасной работы с HTTP запросами.
 * 
 * Особенности:
 * - Стандартные HTTP методы (GET, POST, PUT, PATCH, DELETE)
 * - Заголовки по умолчанию для JSON API
 * - MIME типы для различных форматов данных
 * - Настройки кеширования и таймауты
 * - Полная типизация всех констант
 * - Конфигурация для retry логики
 * 
 * Функциональность:
 * - HTTP_METHODS: стандартные HTTP методы
 * - DEFAULT_HEADERS: заголовки по умолчанию
 * - HTTP_HEADERS: названия заголовков
 * - MIME_TYPES: типы контента
 * - CACHE_CONFIG: настройки кеширования
 * - API_CONFIG: общие настройки API
 */

/**
 * Стандартные HTTP методы
 * 
 * Константы для всех поддерживаемых HTTP методов.
 * Используются для типизации и создания запросов.
 * 
 * @constant HTTP_METHODS
 */
export const HTTP_METHODS = {
  /** GET запрос для получения данных */
  GET: 'GET',
  /** POST запрос для создания ресурсов */
  POST: 'POST',
  /** PUT запрос для полного обновления ресурсов */
  PUT: 'PUT',
  /** PATCH запрос для частичного обновления ресурсов */
  PATCH: 'PATCH',
  /** DELETE запрос для удаления ресурсов */
  DELETE: 'DELETE',
} as const;

/**
 * Заголовки по умолчанию для API запросов
 * 
 * Стандартные заголовки для JSON API запросов.
 * Автоматически добавляются ко всем запросам через утилиты.
 * 
 * @constant DEFAULT_HEADERS
 */
export const DEFAULT_HEADERS = {
  /** Content-Type для JSON данных */
  'Content-Type': 'application/json',
  /** Accept заголовок для JSON ответов */
  'Accept': 'application/json',
} as const;

/**
 * Названия HTTP заголовков
 * 
 * Стандартизированные названия заголовков для использования
 * в коде. Предотвращает опечатки и обеспечивает консистентность.
 * 
 * @constant HTTP_HEADERS
 */
export const HTTP_HEADERS = {
  /** Название заголовка Content-Type */
  CONTENT_TYPE: 'content-type',
  /** Название заголовка Authorization */
  AUTHORIZATION: 'authorization',
  /** Название заголовка Accept */
  ACCEPT: 'accept',
  /** Название заголовка User-Agent */
  USER_AGENT: 'user-agent',
} as const;

/**
 * MIME типы для различных форматов данных
 * 
 * Стандартные MIME типы для работы с различными форматами
 * контента в HTTP запросах и ответах.
 * 
 * @constant MIME_TYPES
 */
export const MIME_TYPES = {
  /** MIME тип для JSON данных */
  JSON: 'application/json',
  /** MIME тип для текстовых данных */
  TEXT: 'text/plain',
  /** MIME тип для HTML контента */
  HTML: 'text/html',
  /** MIME тип для multipart/form-data */
  FORM_DATA: 'multipart/form-data',
} as const;

/**
 * Настройки кеширования для API запросов
 * 
 * Конфигурация для управления кешированием данных
 * в Next.js приложении через revalidation.
 * 
 * @constant CACHE_CONFIG
 */
export const CACHE_CONFIG = {
  /** Время revalidation в секундах */
  REVALIDATE_TIME: 300, // 5 минут вместо 1 минуты
} as const;

/**
 * Общие настройки для API запросов
 * 
 * Конфигурация таймаутов и retry логики для
 * обеспечения надежности API запросов.
 * 
 * @constant API_CONFIG
 */
export const API_CONFIG = {
  /** Таймаут запроса в миллисекундах */
  TIMEOUT: 10000, // 10 секунд
  /** Количество попыток повтора запроса */
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Типы для конфигурации API
 * 
 * TypeScript типы для всех конфигурационных объектов.
 * Обеспечивают типобезопасность при работе с конфигурацией.
 */

/** Тип для HTTP методов */
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];

/** Тип для конфигурации кеширования */
export type CacheConfig = typeof CACHE_CONFIG;

/** Тип для общей конфигурации API */
export type ApiConfig = typeof API_CONFIG;
