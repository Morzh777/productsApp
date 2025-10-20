import { ProductFormSchema, ImageFieldSchema } from '@/shared/schemas/product.schema';
import type { Product } from '@/shared/schemas/product.schema';
import type { FormData, ValidationResult } from '@/types/components/Form.types';

/**
 * Валидирует данные формы продукта
 * 
 * Проверяет все поля формы согласно схеме ProductFormSchema
 * и возвращает результат валидации с ошибками.
 * 
 * @param formData - Данные формы для валидации
 * @returns Результат валидации с флагом успеха и ошибками
 */
export function validateProductForm(formData: FormData): ValidationResult {
  const toValidate = {
    title: formData.title,
    price: formData.price,
    description: formData.description,
    image: formData.image,
    category: formData.category,
    rating: formData.rating,
  };
  
  const validateResult = ProductFormSchema.safeParse(toValidate);
  
  if (!validateResult.success) {
    const flat = validateResult.error.flatten();
    const fieldErrors: Record<string, string> = {};
    Object.entries(flat.fieldErrors).forEach(([key, msgs]) => {
      if (msgs && msgs[0]) fieldErrors[key] = msgs[0];
    });
    return { isValid: false, errors: fieldErrors };
  }
  
  return { isValid: true, errors: {} };
}

/**
 * Валидирует поле изображения
 * 
 * Проверяет URL изображения согласно ImageFieldSchema
 * и возвращает сообщение об ошибке если валидация не прошла.
 * 
 * @param value - URL изображения для валидации
 * @returns Сообщение об ошибке или undefined если валидация прошла
 */
export function validateImageField(value: string): string | undefined {
  const result = ImageFieldSchema.safeParse(value);
  return result.success ? undefined : (result.error.issues?.[0]?.message ?? 'Некорректное значение');
}

/**
 * Проверяет валидность источника изображения
 * 
 * Проверяет, что URL начинается с http://, https:// или data:
 * 
 * @param src - URL источника изображения
 * @returns true если URL валидный, false в противном случае
 */
export function isValidImageSrc(src?: string | null): boolean {
  if (!src) return false;
  return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
}

/**
 * Подготавливает данные продукта для отправки
 * 
 * Преобразует строковые значения формы в соответствующие типы
 * и формирует объект для API запроса.
 * 
 * @param formData - Данные формы
 * @param product - Существующий продукт (для обновления)
 * @returns Объект с данными продукта для API
 */
export function prepareProductPayload(formData: FormData, product?: Product | null): Partial<Product> {
  const payload: Partial<Product> = {
    title: formData.title,
    price: Number(formData.price),
    description: formData.description,
    category: formData.category,
    image: isValidImageSrc(formData.image) ? formData.image : "",
  };
  
  if (formData.rating) payload.rating = Number(formData.rating);
  if (formData.count) payload.count = Number(formData.count);
  if (product?.id) payload.id = product.id;
  
  return payload;
}
