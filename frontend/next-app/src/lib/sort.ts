import type { Product } from "@/shared/schemas/product.schema";

/**
 * Утилиты для сортировки товаров
 * 
 * Предоставляет константы и функции для сортировки списка товаров
 * по различным критериям с типобезопасностью.
 */

export const SORT_OPTIONS = {
  NEWEST: "newest",
  TITLE: "title", 
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  RATING: "rating",
} as const;

export type SortBy = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

/**
 * Сортирует массив товаров по указанному критерию
 * 
 * @param products - Массив товаров для сортировки
 * @param sortBy - Критерий сортировки
 * @returns Новый отсортированный массив товаров
 */
export function sortProductsBy(products: Product[], sortBy: SortBy): Product[] {
  const productsCopy = [...products];
  productsCopy.sort((a, b) => {
    switch (sortBy) {
      case SORT_OPTIONS.NEWEST:
        return b.id - a.id;
      case SORT_OPTIONS.TITLE:
        return a.title.localeCompare(b.title);
      case SORT_OPTIONS.PRICE_ASC:
        return a.price - b.price;
      case SORT_OPTIONS.PRICE_DESC:
        return b.price - a.price;
      case SORT_OPTIONS.RATING:
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  return productsCopy;
}