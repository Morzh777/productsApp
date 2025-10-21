/**
 * Конфигурация роутов приложения
 * 
 * Централизованное управление всеми роутами приложения включая
 * клиентские роуты, API endpoints и пути для revalidation.
 */

/**
 * Клиентские роуты приложения
 */
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/', // Теперь продукты на главной
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
} as const;

/**
 * Получение базового URL для API
 * 
 * Использует переменную окружения NEXT_PUBLIC_API_URL или fallback на прямой backend.
 */
export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
};

/**
 * API endpoints (относительные пути)
 */
export const API_ROUTES = {
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  PRODUCT_CATEGORIES: '/products/categories',
  PRODUCTS_BY_CATEGORY: (category: string) => `/products?category=${category}`,
} as const;

/**
 * Полные URL для API запросов
 */
export const API_URLS = {
  PRODUCTS: `${getApiBaseUrl()}${API_ROUTES.PRODUCTS}`,
  PRODUCT_DETAIL: (id: string | number) => `${getApiBaseUrl()}${API_ROUTES.PRODUCT_DETAIL(id)}`,
  PRODUCT_CATEGORIES: `${getApiBaseUrl()}${API_ROUTES.PRODUCT_CATEGORIES}`,
  PRODUCTS_BY_CATEGORY: (category: string) => `${getApiBaseUrl()}${API_ROUTES.PRODUCTS_BY_CATEGORY(category)}`,
} as const;

/**
 * Пути для Next.js revalidation
 */
export const REVALIDATION_PATHS = {
  HOME: ROUTES.HOME,
  PRODUCTS: ROUTES.PRODUCTS,
  PRODUCT_DETAIL: (id: string | number) => ROUTES.PRODUCT_DETAIL(id),
} as const;

export type RouteKey = keyof typeof ROUTES;
export type ApiRouteKey = keyof typeof API_ROUTES;
