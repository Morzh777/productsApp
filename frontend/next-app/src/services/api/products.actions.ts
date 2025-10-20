'use server';

import { revalidatePath } from 'next/cache';
import { ProductSchema, type Product } from '@/shared/schemas/product.schema';
import { API_URLS, REVALIDATION_PATHS } from '@/config/routes';
import { createPostRequest, createPatchRequest, createDeleteRequest } from '@/config/api-utils';
import { ErrorHandler, ERROR_MESSAGES } from '@/config/errors';

/**
 * Server Actions для работы с товарами
 * 
 * Предоставляет серверные действия для создания, обновления и удаления товаров
 * с автоматическим обновлением кеша Next.js через revalidatePath.
 */

export async function deleteProductAction(id: number) {
  const response = await fetch(API_URLS.PRODUCT_DETAIL(id), createDeleteRequest(API_URLS.PRODUCT_DETAIL(id)));
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.DELETE_FAILED);
  }
  
  revalidatePath(REVALIDATION_PATHS.PRODUCTS);
  
  return true;
}

export async function updateProductAction(id: number, updates: Partial<Product>) {
  const response = await fetch(API_URLS.PRODUCT_DETAIL(id), createPatchRequest(API_URLS.PRODUCT_DETAIL(id), updates));
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.UPDATE_FAILED);
  }
  
  const data = await response.json();
  
  const validationResult = ProductSchema.safeParse(data);
  
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_UPDATED_PRODUCT_FORMAT, validationResult.error);
  }
  
  revalidatePath(REVALIDATION_PATHS.PRODUCTS);
  revalidatePath(REVALIDATION_PATHS.PRODUCT_DETAIL(id));
  
  return validationResult.data;
}

export async function createProductAction(newProduct: Partial<Product>) {
  const response = await fetch(API_URLS.PRODUCTS, createPostRequest(API_URLS.PRODUCTS, newProduct));

  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.CREATE_FAILED);
  }

  const data = await response.json();
  const validationResult = ProductSchema.safeParse(data);
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_CREATED_PRODUCT_FORMAT, validationResult.error);
  }

  revalidatePath(REVALIDATION_PATHS.PRODUCTS);
  return validationResult.data;
}
