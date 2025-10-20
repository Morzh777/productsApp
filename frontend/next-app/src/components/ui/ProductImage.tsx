"use client";

import Image from "next/image";
import { PRODUCT_MESSAGES } from "@/config/ui-messages";
import type { ProductImageProps } from "@/types/components/ProductImage.types";

/**
 * Компонент изображения товара
 * 
 * Отображает изображение товара с поддержкой fallback для случаев,
 * когда изображение недоступно или имеет неверный URL.
 * Поддерживает композитную архитектуру с возможностью добавления дочерних элементов.
 */
export function ProductImage({ product, className = "object-contain object-center", sizes, children }: ProductImageProps) {
  /**
   * Валидирует URL изображения
   */
  const isValidImageSrc = (src?: string | null) => {
    if (!src) return false;
    return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
  };

  return (
    <div className="relative h-80 bg-gray-100 overflow-hidden">
      {isValidImageSrc(product.image) ? (
        <Image
          src={product.image as string}
          alt={product.title}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"}
          className={className}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400 text-lg">{PRODUCT_MESSAGES.NO_IMAGE}</span>
        </div>
      )}
      {children}
    </div>
  );
}
