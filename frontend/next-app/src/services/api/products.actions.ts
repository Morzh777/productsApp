'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { ProductSchema, type Product } from '@/shared/schemas/product.schema';
import { API_URLS, ROUTES } from '@/config/routes';
import { createPostRequest, createPatchRequest, createDeleteRequest } from '@/config/api-utils';
import { ErrorHandler, ERROR_MESSAGES } from '@/config/errors';
import { CACHE_TAGS, CACHE_TAG_FUNCTIONS } from '@/config/cache-tags';

/**
 * Server Actions для работы с товарами
 * 
 * Предоставляет серверные действия для создания, обновления и удаления товаров
 * с автоматическим обновлением кеша Next.js через revalidatePath.
 */

export async function deleteProductAction(id: number) {
  // Добавляем таймаут для запроса
  const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // Увеличиваем до 30 секунд

  const response = await fetch(API_URLS.PRODUCT_DETAIL(id), {
    ...createDeleteRequest(API_URLS.PRODUCT_DETAIL(id)),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.DELETE_FAILED);
  }
  
  // Оптимизированное revalidation
  revalidateTag(CACHE_TAGS.PRODUCTS);
  revalidateTag(CACHE_TAGS.CATEGORIES); // Удаление товара может изменить список категорий
  revalidatePath(ROUTES.HOME); // Обновляем главную страницу
  
  return { success: true, deletedId: id };
}

export async function updateProductAction(id: number, updates: Partial<Product>) {
  // Добавляем таймаут для запроса
  const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // Увеличиваем до 30 секунд

  const response = await fetch(API_URLS.PRODUCT_DETAIL(id), {
    ...createPatchRequest(API_URLS.PRODUCT_DETAIL(id), updates),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.UPDATE_FAILED);
  }
  
  const data = await response.json();
  
  const validationResult = ProductSchema.safeParse(data);
  
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_UPDATED_PRODUCT_FORMAT, validationResult.error);
  }
  
  // Оптимизированное revalidation
  revalidateTag(CACHE_TAG_FUNCTIONS.product(id));
  revalidateTag(CACHE_TAGS.PRODUCTS);
  revalidatePath(ROUTES.HOME); // Обновляем главную страницу
  
  // Сбрасываем кеш категорий ТОЛЬКО если изменилась категория
  if (updates.category) {
    revalidateTag(CACHE_TAGS.CATEGORIES);
    revalidateTag(CACHE_TAG_FUNCTIONS.category(updates.category)); // Обновляем кеш конкретной категории
  }
  
  return validationResult.data;
}

export async function createProductAction(newProduct: Partial<Product>) {
  const response = await fetch(API_URLS.PRODUCTS, {
    ...createPostRequest(API_URLS.PRODUCTS, newProduct),
  });

  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.CREATE_FAILED);
  }

  const data = await response.json();
  const validationResult = ProductSchema.safeParse(data);
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_CREATED_PRODUCT_FORMAT, validationResult.error);
  }

  // Оптимизированное revalidation - только необходимые теги
  revalidateTag(CACHE_TAGS.PRODUCTS);
  revalidatePath(ROUTES.HOME); // Обновляем главную страницу
  
  // Сбрасываем кеш категорий только если это новая категория
  if (newProduct.category) {
    revalidateTag(CACHE_TAGS.CATEGORIES);
    revalidateTag(CACHE_TAG_FUNCTIONS.category(newProduct.category));
  }
  
  return validationResult.data;
}
