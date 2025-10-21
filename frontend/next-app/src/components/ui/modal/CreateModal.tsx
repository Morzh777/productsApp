"use client";

import { useState } from "react";
import type { Product } from "@/shared/schemas/product.schema";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { createProductAction } from "@/app/products/actions/products";
import { ProductForm } from "@/components/ui/form/ProductForm";
import type { CreateProductModalProps } from "@/types/components/CreateProductModal.types";

/**
 * Модальное окно для создания нового продукта
 * 
 * Предоставляет интерфейс для добавления нового товара с использованием
 * декомпозированной формы ProductForm и интеграцией с server actions.
 * 
 * @param props - Пропсы компонента CreateProductModalProps
 * @returns JSX элемент модального окна создания продукта
 */
export function CreateProductModal({ isOpen, onClose, categories = [] }: CreateProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Обработчик создания нового продукта
   * 
   * Преобразует данные формы в FormData для server action,
   * выполняет создание продукта и закрывает модальное окно.
   * 
   * @param formData - Данные формы продукта
   * @returns Promise с созданным продуктом
   */
  const handleCreate = async (formData: Partial<Product>): Promise<Product> => {
    setIsLoading(true);
    try {
      // Сборка данных под server action (ожидает FormData)
      const fd = new FormData();
      if (formData.title !== undefined) fd.append("title", String(formData.title));
      if (formData.price !== undefined) fd.append("price", String(formData.price));
      if (formData.description !== undefined) fd.append("description", String(formData.description));
      if (formData.image !== undefined) fd.append("image", String(formData.image));
      if (formData.category !== undefined) fd.append("category", String(formData.category));
      if (formData.rating !== undefined) fd.append("rating", String(formData.rating));
      
      await createProductAction(fd);
      const created = { ...(formData as Product), id: 0 } as Product;
      onClose();
      return created;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-start justify-center p-2 sm:p-3 overflow-y-auto">
        <DialogPanel className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-3 sm:my-6 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-2rem)] flex flex-col">
          <div className="flex justify-between items-center p-3 sm:p-5 border-b border-gray-200 flex-shrink-0">
            <DialogTitle className="text-xl font-semibold text-gray-900">Добавить товар</DialogTitle>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
          <ProductForm
            product={null}
            onSubmit={handleCreate}
            isLoading={isLoading}
            isDeleting={false}
            categories={categories}
            submitLabel="Добавить"
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}


