import { ProductSchema, type Product } from '@/shared/schemas/product.schema';
import { API_URLS } from '@/config/routes';
import { createGetRequest, createPatchRequest, createDeleteRequest } from '@/config/api-utils';
import { ErrorHandler, ERROR_MESSAGES } from '@/config/errors';
import { MIME_TYPES, HTTP_HEADERS } from '@/config/api';

/**
 * API функции для работы с товарами
 * 
 * Предоставляет типизированные функции для всех операций с товарами:
 * получение, создание, обновление, удаление с валидацией и обработкой ошибок.
 */

export async function getProducts() {
  console.log('🔄 API: Запрос товаров (getProducts) - Stack:', new Error().stack?.split('\n')[2]);
  console.log('🔄 API: Время запроса:', new Date().toISOString());
  const response = await fetch(API_URLS.PRODUCTS, {
    ...createGetRequest(API_URLS.PRODUCTS),
    next: { revalidate: 60, tags: ['products'] }
  });
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.PRODUCTS_NOT_FOUND);
  }
  
  const data = await response.json();
  
  const validationResult = ProductSchema.array().safeParse(data);
  
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_PRODUCTS_FORMAT, validationResult.error);
  }
  
  return validationResult.data;
}

export async function getCategories() {
  console.log('🔄 API: Запрос категорий (getCategories) - Stack:', new Error().stack?.split('\n')[2]);
  const response = await fetch(API_URLS.PRODUCT_CATEGORIES, {
    ...createGetRequest(API_URLS.PRODUCT_CATEGORIES),
    next: { revalidate: 60, tags: ['categories'] }
  });

  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.CATEGORIES_NOT_FOUND);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_CATEGORIES_FORMAT);
  }
  return data.filter((c): c is string => typeof c === 'string');
}

/**
 * Получение товара по ID с расширенной проверкой ответа
 */
export async function getProduct(id: number) {
  const response = await fetch(API_URLS.PRODUCT_DETAIL(id), {
    ...createGetRequest(API_URLS.PRODUCT_DETAIL(id)),
    next: { revalidate: 60, tags: ['products', `product-${id}`] }
  });
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }
  
  const contentType = response.headers.get(HTTP_HEADERS.CONTENT_TYPE);
  
  if (!contentType || !contentType.includes(MIME_TYPES.JSON)) {
    throw ErrorHandler.networkError(ERROR_MESSAGES.INVALID_JSON_RESPONSE);
  }
  
  const text = await response.text();
  
  if (!text.trim()) {
    throw ErrorHandler.networkError(ERROR_MESSAGES.EMPTY_RESPONSE);
  }
  
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw ErrorHandler.networkError(ERROR_MESSAGES.JSON_PARSE_ERROR);
  }
  
  const validationResult = ProductSchema.safeParse(data);
  
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_PRODUCT_FORMAT, validationResult.error);
  }
  
  return validationResult.data;
}

export async function getProductsByCategory(category: string) {
  const response = await fetch(API_URLS.PRODUCTS_BY_CATEGORY(category), createGetRequest(API_URLS.PRODUCTS_BY_CATEGORY(category)));
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.PRODUCTS_NOT_FOUND);
  }
  
  const data = await response.json();
  
  const validationResult = ProductSchema.array().safeParse(data);
  
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_PRODUCTS_FORMAT, validationResult.error);
  }
  
  return validationResult.data;
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  const response = await fetch(API_URLS.PRODUCT_DETAIL(id), createPatchRequest(API_URLS.PRODUCT_DETAIL(id), updates));
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.UPDATE_FAILED);
  }
  
  const data = await response.json();
  
  const validationResult = ProductSchema.safeParse(data);
  
  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.INVALID_UPDATED_PRODUCT_FORMAT, validationResult.error);
  }
  
  return validationResult.data;
}

export async function deleteProduct(id: number) {
  const response = await fetch(API_URLS.PRODUCT_DETAIL(id), createDeleteRequest(API_URLS.PRODUCT_DETAIL(id)));
  
  if (!response.ok) {
    throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.DELETE_FAILED);
  }
  
  return true;
}