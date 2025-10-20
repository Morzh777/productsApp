import { z } from 'zod';

const isAllowedImageUrl = (val: string): boolean => {
  try {
    const u = new URL(val);
    return u.hostname === 'fakestoreapi.com' && u.pathname.startsWith('/img/');
  } catch {
    return false;
  }
};

// Отдельная схема для одиночного поля изображения (клиентская валидация onChange)
export const ImageFieldSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val === '' || isAllowedImageUrl(val),
    'Разрешены только URL из fakestoreapi.com/img/...'
  );

// Схема для товара из нашего бэкенда
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

// Схема для создания товара
export const CreateProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обязательно')
    .max(255, 'Название слишком длинное'),
  price: z.number().positive('Цена должна быть положительной'),
  description: z.string().optional(),
  image: ImageFieldSchema,
  category: z
    .string()
    .min(1, 'Категория обязательна')
    .max(100, 'Категория слишком длинная'),
  rating: z.number().min(0).max(5).optional(),
});

// Схема для обновления товара
export const UpdateProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обязательно')
    .max(255, 'Название слишком длинное')
    .optional(),
  price: z.number().positive('Цена должна быть положительной').optional(),
  description: z.string().optional(),
  image: ImageFieldSchema,
  category: z
    .string()
    .min(1, 'Категория обязательна')
    .max(100, 'Категория слишком длинная')
    .optional(),
  rating: z.number().min(0).max(5).optional(),
});

// Схема для формы товара (строковые значения для input)
export const ProductFormSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(255, 'Название слишком длинное'),
  price: z.string().min(1, 'Цена обязательна').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Цена должна быть положительным числом'
  ),
  description: z.string().optional(),
  image: ImageFieldSchema,
  category: z.string().min(1, 'Категория обязательна').max(100, 'Категория слишком длинная'),
  rating: z.string().optional().refine(
    (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 5),
    'Рейтинг должен быть от 0 до 5'
  ),
});

// Типы, выведенные из схем
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type UpdateProductData = z.infer<typeof UpdateProductSchema>;
export type ProductFormData = z.infer<typeof ProductFormSchema>;
