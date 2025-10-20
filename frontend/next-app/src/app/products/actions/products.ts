"use server";

import { revalidateTag } from "next/cache";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "@/shared/schemas/product.schema";
import { API_URLS } from "@/config/routes";
import { createPostRequest, createPatchRequest, createDeleteRequest } from "@/config/api-utils";
import { ErrorHandler, ERROR_MESSAGES } from "@/config/errors";

// Утилита для извлечения данных из FormData
function extractProductData(formData: FormData) {
  return {
    title: (formData.get("title") as string) || undefined,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    description: (formData.get("description") as string) || undefined,
    image: (formData.get("image") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
  };
}

// Создание товара
export async function createProductAction(formData: FormData) {
  const rawData = extractProductData(formData);

  // Валидация данных
  const validationResult = CreateProductSchema.safeParse(rawData);

  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.VALIDATION_FAILED, validationResult.error);
  }

  const data = validationResult.data;

  try {
    const response = await fetch(API_URLS.PRODUCTS, createPostRequest(API_URLS.PRODUCTS, data));

    if (!response.ok) {
      throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.CREATE_FAILED);
    }
  } catch (error) {
    ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "createProductAction");
    throw ErrorHandler.serverError(ERROR_MESSAGES.CREATE_FAILED);
  }
}

// Обновление товара
export async function updateProductAction(id: number, formData: FormData) {
  const rawData = extractProductData(formData);

  // Убираем пустые поля
  const filteredData = Object.fromEntries(
    Object.entries(rawData).filter(
      ([, value]) => value !== undefined && value !== ""
    )
  );

  // Валидация данных
  const validationResult = UpdateProductSchema.safeParse(filteredData);

  if (!validationResult.success) {
    throw ErrorHandler.validationError(ERROR_MESSAGES.VALIDATION_FAILED, validationResult.error);
  }

  const data = validationResult.data;

  try {
    const response = await fetch(API_URLS.PRODUCT_DETAIL(id), {
      ...createPatchRequest(API_URLS.PRODUCT_DETAIL(id), data)
    });

    if (!response.ok) {
      throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.UPDATE_FAILED);
    }

    // Сбрасываем кеш при редактировании товара
    console.log('🗑️ Сброс кеша: products, categories, product-' + id);
    revalidateTag('products');
    revalidateTag('categories');
    revalidateTag(`product-${id}`);
  } catch (error) {
    ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "updateProductAction");
    throw ErrorHandler.serverError(ERROR_MESSAGES.UPDATE_FAILED);
  }
}

// Удаление товара
export async function deleteProductAction(id: number) {
  try {
    const response = await fetch(API_URLS.PRODUCT_DETAIL(id), {
      ...createDeleteRequest(API_URLS.PRODUCT_DETAIL(id))
    });

    if (!response.ok) {
      throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.DELETE_FAILED);
    }
  } catch (error) {
    ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "deleteProductAction");
    throw ErrorHandler.serverError(ERROR_MESSAGES.DELETE_FAILED);
  }
}
