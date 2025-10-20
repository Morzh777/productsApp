"use client";

import { ProductImage } from "@/components/ui/ProductImage";
import { CategoryTag } from "@/components/ui/CategoryTag";
import type { ProductDetailImageProps } from "@/types/components/ProductDetailImage.types";

/**
 * Компонент изображения товара для страницы деталей
 * 
 * Специализированная версия ProductImage для отображения на странице
 * детальной информации о товаре. Оптимизирован для больших размеров
 * с правильным позиционированием и адаптивными размерами.
 */
export function ProductDetailImage({ product }: ProductDetailImageProps) {
  return (
      <ProductImage 
        product={product} 
        className="object-contain object-center"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      >
        <CategoryTag category={product.category} />
      </ProductImage>
  );
}
