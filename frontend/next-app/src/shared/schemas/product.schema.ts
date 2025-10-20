import { z } from 'zod';

/**
 * Zod схемы для валидации товаров
 * 
 * Предоставляет типизированные схемы валидации для всех операций с товарами:
 * получение, создание, обновление и формы с централизованными константами и сообщениями.
 */

const VALIDATION_LIMITS = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 255,
  CATEGORY_MIN_LENGTH: 1,
  CATEGORY_MAX_LENGTH: 100,
  RATING_MIN: 0,
  RATING_MAX: 5,
  PRICE_MIN: 0,
} as const;

const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Название обязательно',
  TITLE_TOO_LONG: 'Название слишком длинное',
  PRICE_POSITIVE: 'Цена должна быть положительной',
  PRICE_REQUIRED: 'Цена обязательна',
  PRICE_NUMBER: 'Цена должна быть положительным числом',
  CATEGORY_REQUIRED: 'Категория обязательна',
  CATEGORY_TOO_LONG: 'Категория слишком длинная',
  RATING_RANGE: 'Рейтинг должен быть от 0 до 5',
  IMAGE_URL_INVALID: 'Разрешены только URL из fakestoreapi.com/img/...',
} as const;

/**
 * Проверяет, является ли URL изображения допустимым (fakestoreapi.com/img/...)
 */
const isAllowedImageUrl = (val: string): boolean => {
  try {
    const u = new URL(val);
    return u.hostname === 'fakestoreapi.com' && u.pathname.startsWith('/img/');
  } catch {
    return false;
  }
};

/**
 * Схема для валидации поля изображения (клиентская валидация onChange)
 */
export const ImageFieldSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val === '' || isAllowedImageUrl(val),
    VALIDATION_MESSAGES.IMAGE_URL_INVALID
  );

/**
 * Схема для товара из API (с преобразованием строк в числа)
 */
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.string().transform((val) => parseFloat(val)),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  category: z.string(),
  rating: z.string().transform((val) => parseFloat(val)),
  count: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Схема для создания товара (все поля обязательны)
 */
export const CreateProductSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_LIMITS.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(VALIDATION_LIMITS.TITLE_MAX_LENGTH, VALIDATION_MESSAGES.TITLE_TOO_LONG),
  price: z.number().positive(VALIDATION_MESSAGES.PRICE_POSITIVE),
  description: z.string().optional(),
  image: ImageFieldSchema,
  category: z
    .string()
    .min(VALIDATION_LIMITS.CATEGORY_MIN_LENGTH, VALIDATION_MESSAGES.CATEGORY_REQUIRED)
    .max(VALIDATION_LIMITS.CATEGORY_MAX_LENGTH, VALIDATION_MESSAGES.CATEGORY_TOO_LONG),
  rating: z.number().min(VALIDATION_LIMITS.RATING_MIN).max(VALIDATION_LIMITS.RATING_MAX).optional(),
});

/**
 * Схема для обновления товара (все поля опциональны)
 */
export const UpdateProductSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_LIMITS.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(VALIDATION_LIMITS.TITLE_MAX_LENGTH, VALIDATION_MESSAGES.TITLE_TOO_LONG)
    .optional(),
  price: z.number().positive(VALIDATION_MESSAGES.PRICE_POSITIVE).optional(),
  description: z.string().optional(),
  image: ImageFieldSchema,
  category: z
    .string()
    .min(VALIDATION_LIMITS.CATEGORY_MIN_LENGTH, VALIDATION_MESSAGES.CATEGORY_REQUIRED)
    .max(VALIDATION_LIMITS.CATEGORY_MAX_LENGTH, VALIDATION_MESSAGES.CATEGORY_TOO_LONG)
    .optional(),
  rating: z.number().min(VALIDATION_LIMITS.RATING_MIN).max(VALIDATION_LIMITS.RATING_MAX).optional(),
});

/**
 * Схема для формы товара (строковые значения для input полей)
 */
export const ProductFormSchema = z.object({
  title: z.string().min(VALIDATION_LIMITS.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.TITLE_REQUIRED).max(VALIDATION_LIMITS.TITLE_MAX_LENGTH, VALIDATION_MESSAGES.TITLE_TOO_LONG),
  price: z.string().min(VALIDATION_LIMITS.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.PRICE_REQUIRED).refine(
    (val) => !isNaN(Number(val)) && Number(val) > VALIDATION_LIMITS.PRICE_MIN,
    VALIDATION_MESSAGES.PRICE_NUMBER
  ),
  description: z.string().optional(),
  image: ImageFieldSchema,
  category: z.string().min(VALIDATION_LIMITS.CATEGORY_MIN_LENGTH, VALIDATION_MESSAGES.CATEGORY_REQUIRED).max(VALIDATION_LIMITS.CATEGORY_MAX_LENGTH, VALIDATION_MESSAGES.CATEGORY_TOO_LONG),
  rating: z.string().optional().refine(
    (val) => !val || (!isNaN(Number(val)) && Number(val) >= VALIDATION_LIMITS.RATING_MIN && Number(val) <= VALIDATION_LIMITS.RATING_MAX),
    VALIDATION_MESSAGES.RATING_RANGE
  ),
});

// Типы, выведенные из схем
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type UpdateProductData = z.infer<typeof UpdateProductSchema>;
export type ProductFormData = z.infer<typeof ProductFormSchema>;
