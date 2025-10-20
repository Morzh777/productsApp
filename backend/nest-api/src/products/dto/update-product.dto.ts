import { z } from 'zod';

export const UpdateProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обязательно')
    .max(255, 'Название слишком длинное')
    .optional(),
  price: z.number().positive('Цена должна быть положительной').optional(),
  description: z.string().optional(),
  image: z
    .union([
      z.url({ message: 'Неверный URL изображения' }).nullish(),
      z.literal(''),
    ])
    .optional(),
  category: z
    .string()
    .min(1, 'Категория обязательна')
    .max(100, 'Категория слишком длинная')
    .optional(),
  rating: z.number().min(0).max(5).optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
