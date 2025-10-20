/**
 * Утилиты для работы с API
 * 
 * Предоставляет набор утилит для создания и конфигурации HTTP запросов
 * к API. Включает готовые конфигурации для различных типов запросов
 * и функции для создания RequestInit объектов с правильными заголовками.
 * 
 * Особенности:
 * - Готовые конфигурации для GET, POST, PATCH, DELETE запросов
 * - Автоматическое добавление заголовков Content-Type
 * - Настройка кеширования для GET запросов
 * - Типизированные интерфейсы для конфигурации запросов
 * - Утилиты для создания RequestInit объектов
 * - Поддержка Next.js revalidation
 * 
 * Функциональность:
 * - createApiRequest: базовая функция создания запроса
 * - createGetRequest: GET запросы с кешированием
 * - createPostRequest: POST запросы с JSON телом
 * - createPatchRequest: PATCH запросы с JSON телом
 * - createDeleteRequest: DELETE запросы
 * - API_REQUEST_CONFIGS: готовые конфигурации
 */

import { HTTP_METHODS, DEFAULT_HEADERS, CACHE_CONFIG, type HttpMethod } from './api';

/**
 * Конфигурация для API запроса
 * 
 * Определяет параметры HTTP запроса включая метод, заголовки,
 * тело запроса и настройки кеширования для Next.js.
 * 
 * @interface ApiRequestConfig
 */
export interface ApiRequestConfig {
  /** HTTP метод запроса */
  method: HttpMethod;
  /** Дополнительные заголовки запроса */
  headers?: Record<string, string>;
  /** Тело запроса в виде строки */
  body?: string;
  /** Настройки кеширования браузера */
  cache?: RequestCache;
  /** Настройки Next.js для revalidation */
  next?: {
    /** Время revalidation в секундах */
    revalidate?: number;
  };
}

/**
 * Базовые конфигурации для разных типов HTTP запросов
 * 
 * Предопределенные конфигурации для стандартных HTTP методов
 * с правильными заголовками и настройками кеширования.
 * 
 * Конфигурации:
 * - GET: с настройкой revalidation для кеширования
 * - POST: с заголовками для JSON данных
 * - PATCH: с заголовками для JSON данных
 * - DELETE: базовая конфигурация без дополнительных заголовков
 * 
 * @constant API_REQUEST_CONFIGS
 */
export const API_REQUEST_CONFIGS = {
  /** Конфигурация для GET запросов с кешированием */
  GET: {
    method: HTTP_METHODS.GET,
    next: { revalidate: CACHE_CONFIG.REVALIDATE_TIME },
  },
  /** Конфигурация для POST запросов с JSON заголовками */
  POST: {
    method: HTTP_METHODS.POST,
    headers: DEFAULT_HEADERS,
  },
  /** Конфигурация для PATCH запросов с JSON заголовками */
  PATCH: {
    method: HTTP_METHODS.PATCH,
    headers: DEFAULT_HEADERS,
  },
  /** Конфигурация для DELETE запросов */
  DELETE: {
    method: HTTP_METHODS.DELETE,
  },
} as const;

/**
 * Базовая утилита для создания API запроса
 * 
 * Создает RequestInit объект с правильными заголовками и конфигурацией.
 * Автоматически добавляет DEFAULT_HEADERS и позволяет переопределить
 * любые параметры через config.
 * 
 * @param url - URL для запроса (не используется в RequestInit, но сохраняется для совместимости)
 * @param config - Частичная конфигурация запроса
 * @returns RequestInit объект готовый для использования в fetch
 */
export function createApiRequest(
  url: string,
  config: Partial<ApiRequestConfig> = {}
): RequestInit {
  return {
    ...config,
    headers: {
      ...DEFAULT_HEADERS,
      ...config.headers,
    },
  };
}

/**
 * Утилита для создания GET запросов с кешированием
 * 
 * Создает RequestInit для GET запроса с настройками кеширования
 * через Next.js revalidation. Оптимизирована для получения данных
 * с автоматическим обновлением кеша.
 * 
 * @param url - URL для запроса
 * @returns RequestInit объект для GET запроса
 */
export function createGetRequest(url: string): RequestInit {
  return createApiRequest(url, API_REQUEST_CONFIGS.GET);
}

/**
 * Утилита для создания POST запросов
 * 
 * Создает RequestInit для POST запроса с JSON заголовками.
 * Автоматически сериализует тело запроса в JSON если оно предоставлено.
 * 
 * @param url - URL для запроса
 * @param body - Данные для отправки (будут сериализованы в JSON)
 * @returns RequestInit объект для POST запроса
 */
export function createPostRequest(url: string, body?: unknown): RequestInit {
  return createApiRequest(url, {
    ...API_REQUEST_CONFIGS.POST,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Утилита для создания PATCH запросов
 * 
 * Создает RequestInit для PATCH запроса с JSON заголовками.
 * Автоматически сериализует тело запроса в JSON если оно предоставлено.
 * Используется для частичного обновления ресурсов.
 * 
 * @param url - URL для запроса
 * @param body - Данные для отправки (будут сериализованы в JSON)
 * @returns RequestInit объект для PATCH запроса
 */
export function createPatchRequest(url: string, body?: unknown): RequestInit {
  return createApiRequest(url, {
    ...API_REQUEST_CONFIGS.PATCH,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Утилита для создания DELETE запросов
 * 
 * Создает RequestInit для DELETE запроса без дополнительных заголовков.
 * Используется для удаления ресурсов на сервере.
 * 
 * @param url - URL для запроса
 * @returns RequestInit объект для DELETE запроса
 */
export function createDeleteRequest(url: string): RequestInit {
  return createApiRequest(url, API_REQUEST_CONFIGS.DELETE);
}
