'use server';

import { revalidatePath } from 'next/cache';
import { ProductSchema, type Product } from '../../shared/schemas/product.schema';

const API_BASE_URL = 'http://localhost:3002/api';

// Server Actions для работы с товарами

export async function deleteProductAction(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Ошибка при удалении товара');
  }
  
  // Обновляем кеш страницы продуктов
  revalidatePath('/products');
  
  return true;
}

export async function updateProductAction(id: number, updates: Partial<Product>) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Ошибка при обновлении товара');
  }
  
  const data = await response.json();
  
  // Валидация ответа
  const validationResult = ProductSchema.safeParse(data);
  
  if (!validationResult.success) {
    console.error('Ошибка валидации обновленного товара:', validationResult.error);
    throw new Error('Неверный формат данных обновленного товара');
  }
  
  // Обновляем кеш страницы продуктов и конкретного товара
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  
  return validationResult.data;
}

export async function createProductAction(newProduct: Partial<Product>) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });

  if (!response.ok) {
    throw new Error('Ошибка при создании товара');
  }

  const data = await response.json();
  const validationResult = ProductSchema.safeParse(data);
  if (!validationResult.success) {
    console.error('Ошибка валидации созданного товара:', validationResult.error);
    throw new Error('Неверный формат данных созданного товара');
  }

  revalidatePath('/products');
  return validationResult.data;
}
