"use client";

import type { ProductFilterProps } from "@/types/components/ProductFilter.types";
import { SortSelect } from "@/components/ui/SortSelect";
 
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateProductModal } from "@/components/ui/modal/CreateModal";
 

export function ProductFilter({
  categories,
  sortBy,
  onSortChange,
  totalProducts,
  filteredProducts,
}: ProductFilterProps) {
  const sortOptions = [
    { value: "newest", label: "Новые" },
    { value: "price-asc", label: "Цена: по возрастанию" },
    { value: "price-desc", label: "Цена: по убыванию" },
    { value: "rating", label: "По рейтингу" },
  ];

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="w-full flex justify-between items-center mb-6">
      {/* Слева: кнопка, открывает модал создания */}
      <Button onClick={() => setIsCreateOpen(true)} variant="edit" className="w-auto h-[44px] px-6 text-sm rounded-l-[22px] rounded-r-[22px]">
        Добавить
      </Button>

      {/* Справа: счётчик + сортировка */}
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600">
          {`Показано 1-${Math.min(filteredProducts, 10)} из ${totalProducts} товаров`}
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
