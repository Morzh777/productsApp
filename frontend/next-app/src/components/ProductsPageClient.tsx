"use client";

import { useMemo } from "react";
import { ProductFilter } from "@/components/ui/ProductFilter";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyProductsState } from "@/components/ui/EmptyProductsState";
import { sortProductsBy } from "@/lib/sort";
import type { SortBy } from "@/lib/sort";
import { useProductQueryState } from "@/hooks/useProductQueryState";
import type { ProductsPageClientProps } from "@/types/components/ProductsPageClient.types";

/**
 * Клиентский компонент страницы списка товаров
 * 
 * Управляет состоянием поиска, категорий и сортировки через URL параметры.
 * Отображает товары в адаптивной сетке с фильтрацией и сортировкой.
 */
export function ProductsPageClient({ products, categories = [] }: ProductsPageClientProps) {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, sortBy, setSortBy } = useProductQueryState({ sortBy: "newest" });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
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
        <EmptyProductsState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
