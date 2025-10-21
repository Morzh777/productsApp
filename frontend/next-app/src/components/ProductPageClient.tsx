"use client";

import { useState } from "react";
import type { Product } from "@/shared/schemas/product.schema";
import { EditProductModal } from "@/components/ui/modal/EditModal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductDetailImage } from "@/components/ui/ProductDetailImage";
import { ProductDetailInfo } from "@/components/ui/ProductDetailInfo";
import { updateProductAction, deleteProductAction } from "@/services/api/products.actions";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { ErrorHandler } from "@/config/errors";
import type { ProductPageClientProps } from "@/types/components/ProductPageClient.types";

/**
 * Клиентский компонент страницы товара
 * 
 * Предоставляет полный интерфейс для отображения детальной информации о товаре
 * с возможностью редактирования и удаления. Управляет состоянием товара и
 * интеграцией с модальными окнами для редактирования.
 * 
 * Особенности:
 * - Отображение полной информации о товаре в адаптивном макете
 * - Интеграция с модальным окном редактирования товара
 * - Управление состоянием товара с обновлением после редактирования
 * - Навигация с хлебными крошками
 * - Обработка операций сохранения и удаления товара
 * - Централизованная обработка ошибок через ErrorHandler
 * - Принудительное обновление страницы для сброса кеша
 * - Адаптивный дизайн с grid layout для мобильных и десктопов
 */
export function ProductPageClient({ product, categories = [] }: ProductPageClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const router = useRouter();

  /**
   * Обработчик сохранения изменений товара
   * 
   * Выполняет обновление товара через API, обновляет локальное состояние
   * и принудительно обновляет текущую страницу для сброса браузерного кеша.
   * 
   * @param updatedProduct - Обновленные данные товара
   * @returns Promise с сохраненным товаром
   */
  const handleSave = async (updatedProduct: Partial<Product>) => {
    try {
      const savedProduct = await updateProductAction(currentProduct.id, updatedProduct);
      setCurrentProduct(savedProduct);
      
      // Принудительно обновляем текущую страницу и главную страницу
      router.refresh();
      
      // Также обновляем главную страницу, чтобы там была актуальная цена
      window.location.href = ROUTES.PRODUCTS;
      
      return savedProduct;
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "handleSave");
      throw error;
    }
  };

  /**
   * Обработчик удаления товара
   * 
   * Выполняет удаление товара через API и перенаправляет пользователя
   * на страницу списка товаров с принудительным обновлением кеша.
   * 
   * @param productId - ID товара для удаления
   */
  const handleDelete = async (productId: number) => {
    try {
      // Сначала удаляем товар
      await deleteProductAction(productId);
      
      // Затем переходим на главную страницу с принудительным обновлением
      router.push(ROUTES.PRODUCTS);
      router.refresh(); // Принудительно обновляем страницу
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "handleDelete");
      throw error;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <Breadcrumbs productTitle={currentProduct.title} />

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Изображение товара */}
              <ProductDetailImage product={currentProduct} />

              {/* Информация о товаре */}
              <ProductDetailInfo 
                product={currentProduct} 
                onEdit={() => setIsEditModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно редактирования */}
      <EditProductModal
        product={currentProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        categories={categories}
      />
    </>
  );
}
