/**
 * Константы для тегов кеша Next.js
 * 
 * Централизованное управление тегами кеша для обеспечения консистентности
 * и упрощения поддержки кода. Все теги кеша определены в одном месте.
 */

/**
 * Базовые теги кеша для товаров
 */
export const CACHE_TAGS = {
  /** Тег для списка всех товаров */
  PRODUCTS: 'products',
  /** Тег для списка категорий */
  CATEGORIES: 'categories',
} as const;

/**
 * Функции для создания динамических тегов кеша
 */
export const CACHE_TAG_FUNCTIONS = {
  /**
   * Создает тег для конкретного товара
   * @param id - ID товара
   * @returns Тег кеша для товара
   */
  product: (id: number) => `product-${id}`,
  
  /**
   * Создает тег для конкретной категории
   * @param category - Название категории
   * @returns Тег кеша для категории
   */
  category: (category: string) => `category-${category}`,
} as const;

/**
 * Типы для тегов кеша
 */
export type CacheTag = typeof CACHE_TAGS[keyof typeof CACHE_TAGS];
export type DynamicCacheTag = ReturnType<typeof CACHE_TAG_FUNCTIONS[keyof typeof CACHE_TAG_FUNCTIONS]>;
