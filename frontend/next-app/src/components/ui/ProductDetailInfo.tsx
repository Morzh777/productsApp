"use client";

import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { NAVIGATION_MESSAGES } from "@/config/ui-messages";
import Image from "next/image";
import type { ProductDetailInfoProps } from "@/types/components/ProductDetailInfo.types";

/**
 * Компонент детальной информации о товаре
 * 
 * Отображает полную информацию о товаре на странице детального просмотра,
 * включая название, рейтинг, цену, описание и кнопки действий.
 * Предоставляет интерфейс для редактирования товара и навигации назад.
 */
export function ProductDetailInfo({ product, onEdit }: ProductDetailInfoProps) {
  return (
    <div className="space-y-6 flex flex-col justify-between h-full">
      {/* Название */}
      <h1 className="text-3xl font-bold text-gray-900">
        {product.title}
      </h1>

      {/* Рейтинг */}
      <div className="flex items-center gap-2">
        <StarRating rating={product.rating} count={product.count} />
      </div>

      {/* Цена */}
      <div className="text-4xl font-bold text-gray-900">
        ${product.price}
      </div>

      {/* Описание */}
      {product.description && (
        <div>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Разделитель */}
      <div className="w-full h-[1px] bg-[#F0F0F0] mt-auto"></div>

      {/* Кнопки действий */}
      <div className="flex justify-between gap-4 pt-6">
        <Button href="/" variant="back" className="px-28 sm:px-25 max-sm:w-[52px] max-sm:h-[52px] max-sm:px-0 max-sm:rounded-full">
          <span className="max-sm:hidden">{NAVIGATION_MESSAGES.BACK}</span>
          <span className="max-sm:inline hidden">
            <Image
              src="/icons/arrow-left.png"
              alt="Назад"
              width={24}
              height={24}
            />
          </span>
        </Button>
        <Button 
          onClick={onEdit}
          variant="edit"
        >
          {NAVIGATION_MESSAGES.EDIT}
        </Button>
      </div>
    </div>
  );
}
