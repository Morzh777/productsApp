import { useState, useEffect } from 'react';
import type { Product } from '@/shared/schemas/product.schema';
import type { FormData, FormErrors } from '@/types/components/Form.types';

/**
 * Хук для управления состоянием формы продукта
 * 
 * Предоставляет полный набор функций для работы с формой:
 * - Инициализация данных из продукта
 * - Обновление полей формы
 * - Управление ошибками валидации
 * - Очистка ошибок при изменении полей
 * 
 * @param product - Объект продукта для инициализации формы
 * @returns Объект с данными формы и методами управления
 */
export function useProductForm(product: Product | null) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    count: "",
    image: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Обновляем форму при изменении продукта
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price ? product.price.toString() : "",
        description: product.description || "",
        category: product.category || "",
        rating: product.rating ? product.rating.toString() : "",
        count: product.count ? product.count.toString() : "",
        image: product.image || "",
      });
    }
  }, [product]);

  /**
   * Обновляет значение поля формы и очищает соответствующую ошибку
   * @param field - Название поля для обновления
   * @param value - Новое значение поля
   */
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /**
   * Устанавливает или очищает ошибку для конкретного поля
   * @param field - Название поля
   * @param message - Сообщение об ошибке (undefined для очистки)
   */
  const setFieldError = (field: string, message?: string) => {
    setErrors(prev => {
      const next = { ...prev };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  /**
   * Устанавливает все ошибки формы одновременно
   * @param newErrors - Объект с ошибками
   */
  const setAllErrors = (newErrors: FormErrors) => {
    setErrors(newErrors);
  };

  /**
   * Очищает все ошибки формы
   */
  const clearErrors = () => {
    setErrors({});
  };

  return {
    formData,
    errors,
    updateField,
    setFieldError,
    setAllErrors,
    clearErrors,
  };
}
