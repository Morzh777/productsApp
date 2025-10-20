"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { StarRating } from "@/components/ui/StarRating";
import { ROUTES } from "@/config/routes";
import type { ProductCardProps } from "@/types/components/ProductCard.types";

/**
 * Компонент карточки товара
 * 
 * Отображает полную информацию о товаре в виде интерактивной карточки
 * с изображением, названием, описанием, рейтингом и ценой. При клике
 * перенаправляет на страницу детальной информации о товаре.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      key={product.id}
      href={ROUTES.PRODUCT_DETAIL(product.id)}
      className="block h-full"
    >
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer relative h-full flex flex-col min-w-0">
        <ProductImage product={product}>
          <CategoryTag category={product.category} />
        </ProductImage>

        <div className="p-6 flex flex-col flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 hover:text-blue-600 transition-colors text-truncate min-w-0 break-words min-h-[3em]">
            {product.title}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow text-truncate min-w-0 break-words min-h-[3em]">
              {product.description}
            </p>
          )}

          <div className="mb-4">
            <StarRating rating={product.rating} count={product.count} />
          </div>

          <div className="mt-auto">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
