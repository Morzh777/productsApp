"use client";

import { useState } from "react";
import type { EditProductModalProps } from "@/types/components/EditProductModal.types";
import type { Product } from "@/shared/schemas/product.schema";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ProductForm } from "@/components/ui/form/ProductForm";
import { DeleteConfirmModal } from "@/components/ui/modal/DeleteModal";
import { updateProductAction, deleteProductAction } from "@/app/products/actions/products";
import { ErrorHandler } from "@/config/errors";

/**
 * Модальное окно редактирования продукта
 * 
 * Предоставляет полный интерфейс для редактирования существующего товара
 * с возможностью сохранения изменений и удаления продукта.
 * 
 * @param props - Пропсы компонента EditProductModalProps
 * @returns JSX элемент модального окна редактирования продукта
 */
export function EditProductModal({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories = [],
}: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async (formData: Partial<Product>): Promise<Product> => {
    setIsLoading(true);
    try {
      if (!product) throw ErrorHandler.serverError("Нет продукта для редактирования");
      const fd = new FormData();
      if (formData.title !== undefined) fd.append("title", String(formData.title));
      if (formData.price !== undefined) fd.append("price", String(formData.price));
      if (formData.description !== undefined) fd.append("description", String(formData.description));
      if (formData.image !== undefined) fd.append("image", String(formData.image));
      if (formData.category !== undefined) fd.append("category", String(formData.category));
      if (formData.rating !== undefined) fd.append("rating", String(formData.rating));
      // If parent provided an override, delegate to it; otherwise use default action
      if (onSave) {
        const savedByParent = await onSave(formData);
        onClose();
        return savedByParent;
      }

      await updateProductAction(product.id, fd);
      const savedProduct = { ...(product as Product), ...formData } as Product;
      onClose();
      return savedProduct;
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "handleSave");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!product) return;
    
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(product.id);
      } else {
        await deleteProductAction(product.id);
      }
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "handleDelete");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!product) return null;

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        
        <div className="fixed inset-0 flex items-start justify-center p-2 sm:p-3 overflow-y-auto">
          <DialogPanel className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-3 sm:my-6 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-2rem)] flex flex-col">
            {/* Заголовок */}
            <div className="flex justify-between items-center p-3 sm:p-5 border-b border-gray-200 flex-shrink-0">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Редактировать товар
              </DialogTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Форма */}
            <ProductForm
              product={product}
              onSubmit={handleSave}
              onDelete={handleDelete}
              isLoading={isLoading}
              isDeleting={isDeleting}
              categories={categories}
            />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmModal
        product={product}
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
