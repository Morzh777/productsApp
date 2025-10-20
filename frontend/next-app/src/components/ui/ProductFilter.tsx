"use client";

import type { ProductFilterProps } from "@/types/components/ProductFilter.types";
import { SortSelect } from "@/components/ui/SortSelect";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateProductModal } from "@/components/ui/modal/CreateModal";
import { SORT_MESSAGES, PRODUCT_MESSAGES, NAVIGATION_MESSAGES } from "@/config/ui-messages";

/**
 * Компонент фильтра и управления товарами
 * 
 * Предоставляет интерфейс для управления списком товаров, включая
 * создание новых товаров, сортировку и отображение статистики.
 * Объединяет функциональность добавления товаров и сортировки в одном компоненте.
 */
export function ProductFilter({
  categories,
  sortBy,
  onSortChange,
  totalProducts,
  filteredProducts,
}: ProductFilterProps) {
  /**
   * Опции для сортировки товаров
   */
  const sortOptions = [
    { value: "newest", label: SORT_MESSAGES.NEWEST },
    { value: "price-asc", label: SORT_MESSAGES.PRICE_ASC },
    { value: "price-desc", label: SORT_MESSAGES.PRICE_DESC },
    { value: "rating", label: SORT_MESSAGES.RATING },
  ];

  /**
   * Состояние открытия модального окна создания товара
   */
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="w-full flex justify-between items-center mb-6">
      {/* Слева: кнопка, открывает модал создания */}
      <Button 
        onClick={() => setIsCreateOpen(true)} 
        variant="add"
        className="sm:w-auto sm:h-[44px] sm:px-6 sm:rounded-l-[22px] sm:rounded-r-[22px] sm:text-sm sm:font-semibold"
      >
        <span className="sm:inline hidden">{NAVIGATION_MESSAGES.ADD}</span>
        <span className="sm:hidden inline">+</span>
      </Button>

      {/* Справа: счётчик + сортировка */}
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600 hidden md:block">
          {`${PRODUCT_MESSAGES.SHOWING_PRODUCTS} 1-${filteredProducts} ${PRODUCT_MESSAGES.OF_PRODUCTS} ${totalProducts} ${PRODUCT_MESSAGES.PRODUCTS_COUNT}`}
        </div>
        <SortSelect value={sortBy} onChange={onSortChange} options={sortOptions} />
      </div>
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        categories={categories}
      />
    </div>
  );
}
