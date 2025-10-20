import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/api";
import type { Product } from "@/shared/schemas/product.schema";
import { ProductsPageClient } from "@/components/ProductsPageClient";
import { ERROR_MESSAGES } from "@/config/errors";

/**
 * Главная страница приложения
 * 
 * Особенности:
 * - Отображает список всех товаров с возможностью фильтрации и сортировки
 * - Кешируется на 60 секунд для оптимизации производительности
 * - Загружает данные товаров и категорий параллельно
 * - Обрабатывает ошибки gracefully (не ломает страницу)
 * - Использует ISR (Incremental Static Regeneration) для быстрой загрузки
 * - Интегрирует клиентский компонент для интерактивности
 */

// Кешируем главную страницу на 60 секунд для оптимизации
export const revalidate = 60;

/**
 * Компонент главной страницы
 * 
 * @returns JSX элемент главной страницы с товарами или сообщением об ошибке
 */
export default async function Home() {
  let products: Product[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    // Параллельная загрузка данных для оптимизации производительности
    [products, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch (err) {
    // Обработка ошибок с fallback сообщением
    error = err instanceof Error ? err.message : ERROR_MESSAGES.PRODUCTS_NOT_FOUND;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error ? (
          // Отображение ошибки с дружелюбным интерфейсом
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Ошибка: {error}</p>
          </div>
        ) : (
          // Основной контент с Suspense для плавной загрузки
          <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
            <ProductsPageClient products={products} categories={categories} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
