"use client";

import { PRODUCT_MESSAGES } from "@/config/ui-messages";

/**
 * Компонент пустого состояния для списка товаров
 * 
 * Отображается когда в списке товаров нет элементов для показа.
 * Предоставляет информативное сообщение пользователю о том, что товары
 * не найдены и предлагает добавить новые товары.
 */
export function EmptyProductsState() {
  return (
    <div className="text-center py-12">
      <p className="text-gray-600 text-lg">{PRODUCT_MESSAGES.NO_PRODUCTS_FOUND}</p>
      <p className="text-gray-500 text-sm mt-2">
        {PRODUCT_MESSAGES.ADD_PRODUCTS_TO_VIEW}
      </p>
    </div>
  );
}
