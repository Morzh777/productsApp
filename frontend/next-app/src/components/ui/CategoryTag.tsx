"use client";

import { useRouter } from "next/navigation";
import type { CategoryTagProps } from "@/types/components/CategoryTag.types";

/**
 * Компонент тега категории
 * 
 * Отображает интерактивный тег категории с возможностью фильтрации товаров
 * по выбранной категории. При клике перенаправляет на главную страницу
 * с параметром фильтрации по категории.
 */
export function CategoryTag({ category, className = "absolute bottom-2 left-2" }: CategoryTagProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/?category=${encodeURIComponent(category)}`);
  };

  return (
    <span 
      className={`${className} text-sm text-white bg-black/70 px-2 py-1 rounded-full hover:bg-black/80 transition-colors cursor-pointer`}
      onClick={handleClick}
    >
      {category}
    </span>
  );
}
