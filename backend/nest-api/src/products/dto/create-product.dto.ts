import { z } from 'zod';

export const CreateProductSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обязательно')
    .max(255, 'Название слишком длинное'),
  price: z.number().positive('Цена должна быть положительной'),
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
    .max(100, 'Категория слишком длинная'),
  rating: z.number().min(0).max(5).optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
