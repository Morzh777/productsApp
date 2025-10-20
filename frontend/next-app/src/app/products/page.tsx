import { getProducts, getCategories } from "@/lib/api";
import type { Product } from "@/shared/schemas/product.schema";
import { ProductsPageClient } from "@/components/ProductsPageClient";

// Кэширование на 1 минуту
export const revalidate = 60;

export default async function ProductsPage() {
  let products: Product[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Ошибка загрузки товаров";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Ошибка: {error}</p>
          </div>
        ) : (
          <ProductsPageClient products={products} categories={categories} />
        )}
      </div>
    </div>
  );
}