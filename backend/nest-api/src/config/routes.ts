/**
 * Конфигурация роутов бекенда
 *
 * Централизованное управление всеми роутами API включая
 * endpoints, пути для контроллеров и маршруты.
 */

/**
 * Базовые пути для API контроллеров
 */
export const API_ROUTES = {
  /** Базовый путь для продуктов */
  PRODUCTS: '/api/products',
  /** Путь для получения товара по ID */
  PRODUCT_DETAIL: (id: string | number) => `/api/products/${id}`,
  /** Путь для получения категорий */
  PRODUCT_CATEGORIES: '/api/products/categories',
  /** Путь для получения товаров по категории */
  PRODUCTS_BY_CATEGORY: (category: string) =>
    `/api/products?category=${category}`,
} as const;

/**
 * Swagger документация
 */
export const SWAGGER_ROUTES = {
  /** Основная страница Swagger */
  MAIN: '/api',
  /** JSON схема Swagger */
  JSON: '/api-json',
} as const;

/**
 * Типы для роутов
 */
export type ApiRouteKey = keyof typeof API_ROUTES;
