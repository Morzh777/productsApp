"use client";

import Link from "next/link";
import type { CategoryTagProps } from "@/types/components/CategoryTag.types";

/**
 * Компонент тега категории
 * 
 * Отображает интерактивный тег категории с возможностью фильтрации товаров
 * по выбранной категории. При клике перенаправляет на главную страницу
 * с параметром фильтрации по категории.
 */
export function CategoryTag({ category, className = "absolute bottom-2 left-2" }: CategoryTagProps) {
  return (
    <Link href={`/?category=${encodeURIComponent(category)}`} className={className}>
      <span className="text-sm text-white bg-black/70 px-2 py-1 rounded-full hover:bg-black/80 transition-colors cursor-pointer">
        {category}
      </span>
    </Link>
  );
}
