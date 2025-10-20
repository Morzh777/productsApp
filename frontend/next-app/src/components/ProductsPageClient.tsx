"use client";

import { useMemo } from "react";
import type { Product } from "@/shared/schemas/product.schema";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";
import { ProductFilter } from "@/components/ui/ProductFilter";
import { sortProductsBy } from "@/lib/sort";
import type { SortBy } from "@/lib/sort";
import { useProductQueryState } from "@/hooks/useProductQueryState";

interface ProductsPageClientProps {
  products: Product[];
  categories?: string[];
}

export function ProductsPageClient({ products, categories = [] }: ProductsPageClientProps) {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, sortBy, setSortBy } = useProductQueryState({ sortBy: "newest" });

  const isValidImageSrc = (src?: string | null) => {
    if (!src) return false;
    return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
  };

  // Фильтрация и сортировка продуктов
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Сортировка 
    filtered = sortProductsBy(filtered, sortBy);

    return filtered;
  }, [products, sortBy]);

  return (
    <>
      {/* Фильтр */}
      <div className="max-w-7xl mx-auto px-0">
        <ProductFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={(v) => setSortBy(v as SortBy)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalProducts={products.length}
          filteredProducts={filteredAndSortedProducts.length}
        />
      </div>

      {/* Результаты */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Товары не найдены</p>
          <p className="text-gray-500 text-sm mt-2">
            Попробуйте изменить параметры поиска или фильтрации
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredAndSortedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block h-full"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer relative h-full flex flex-col min-w-0">
                {/* Изображение товара */}
                <div className="relative h-80 bg-gray-100 overflow-visible">
                  {isValidImageSrc(product.image) ? (
                    <Image
                      src={product.image as string}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-contain object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-lg">Нет изображения</span>
                    </div>
                  )}
                  
                  {/* Тег категории */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-sm text-white bg-black bg-opacity-70 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Контент карточки */}
                <div className="p-6 flex flex-col flex-grow min-w-0">
                  {/* Название товара */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 hover:text-blue-600 transition-colors text-truncate min-w-0 break-words min-h-[3em]">
                    {product.title}
                  </h3>

                  {/* Описание */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow text-truncate min-w-0 break-words min-h-[3em]">
                      {product.description}
                    </p>
                  )}

                  {/* Рейтинг */}
                  <div className="mb-4">
                    <StarRating rating={product.rating} count={product.count} />
                  </div>

                  {/* Цена - всегда внизу */}
                  <div className="mt-auto">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
