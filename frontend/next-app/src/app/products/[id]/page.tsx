import { getProduct, getCategories } from "@/lib/api";
import type { Product } from "@/shared/schemas/product.schema";
import type { ProductPageProps } from "@/types/pages/ProductPage.types";
import { ProductPageClient } from "@/components/ProductPageClient";
import { notFound } from "next/navigation";
import { ErrorHandler } from "@/config/errors";

/**
 * Страница детального просмотра товара
 * 
 * Особенности:
 * - Кешируется на 60 секунд для оптимизации производительности
 * - Загружает данные товара и список категорий параллельно
 * - Обрабатывает ошибки gracefully (не ломает страницу)
 * - Использует ISR (Incremental Static Regeneration) для быстрой загрузки
 */
export const revalidate = 60;

/**
 * Компонент страницы товара
 * 
 * @param params - Параметры маршрута, содержащие ID товара
 * @returns JSX элемент страницы товара или редирект на 404
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product: Product | null = null;
  let categories: string[] = [];

  try {
    // Параллельная загрузка данных для оптимизации
    [product, categories] = await Promise.all([
      getProduct(Number(id)),
      getCategories()
    ]);
  } catch (err) {
    // Логируем ошибку только в development режиме для отладки
    if (process.env.NODE_ENV === 'development') {
      ErrorHandler.logError(ErrorHandler.handleUnknownError(err), "ProductPage");
    }
    // В production просто молча обрабатываем ошибку, чтобы не сломать UX
  }

  // Если товар не найден, показываем 404 страницу
  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} categories={categories} />;
}