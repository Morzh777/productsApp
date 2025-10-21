"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "@/shared/schemas/product.schema";
import { API_URLS, ROUTES } from "@/config/routes";
import { createPostRequest, createPatchRequest, createDeleteRequest } from "@/config/api-utils";
import { ErrorHandler, ERROR_MESSAGES } from "@/config/errors";
import { CACHE_TAGS, CACHE_TAG_FUNCTIONS } from "@/config/cache-tags";

// Утилита для извлечения данных из FormData
function extractProductData(formData: FormData) {
  const title = formData.get("title") as string | null;
  const priceStr = formData.get("price") as string | null;
  const description = formData.get("description") as string | null;
  const image = formData.get("image") as string | null;
  const category = formData.get("category") as string | null;
  const ratingStr = formData.get("rating") as string | null;

  return {
    title: title?.trim() || undefined,
    price: priceStr ? Number(priceStr) : undefined,
    description: description?.trim() || undefined,
    image: image?.trim() || undefined,
    category: category?.trim() || undefined,
    rating: ratingStr ? Number(ratingStr) : undefined,
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
    const response = await fetch(API_URLS.PRODUCTS, {
      ...createPostRequest(API_URLS.PRODUCTS, data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create product error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        data
      });
      throw ErrorHandler.handleHttpError(response.status, `${ERROR_MESSAGES.CREATE_FAILED}: ${errorText}`);
    }

    const result = await response.json();

    // Оптимизированный сброс кеша - только необходимые теги
    revalidateTag(CACHE_TAGS.PRODUCTS);
    revalidatePath(ROUTES.HOME); // Обновляем главную страницу
    
    // Сбрасываем кеш категорий только если это новая категория
    if (data.category) {
      revalidateTag(CACHE_TAGS.CATEGORIES);
      revalidateTag(CACHE_TAG_FUNCTIONS.category(data.category));
    }

    return result;
  } catch (error) {
    ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "createProductAction");
    
    // Проверяем, не создался ли товар на самом деле (проверяем по названию)
    try {
      const checkResponse = await fetch(API_URLS.PRODUCTS);
      if (checkResponse.ok) {
        const products = await checkResponse.json();
        const existingProduct = products.find((p: { title: string; price: number; category: string }) => 
          p.title === data.title && 
          p.price === data.price && 
          p.category === data.category
        );
        
        if (existingProduct) {
          console.log('✅ Product was actually created, updating cache');
          revalidateTag(CACHE_TAGS.PRODUCTS);
          revalidatePath(ROUTES.HOME);
          return existingProduct;
        }
      }
    } catch {
      console.log('Could not verify if product was created');
    }
    
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
      ...createPatchRequest(API_URLS.PRODUCT_DETAIL(id), data),
    });

    if (!response.ok) {
      throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.UPDATE_FAILED);
    }

    const result = await response.json();

    // Принудительное обновление кеша для немедленного эффекта
    revalidateTag(CACHE_TAGS.PRODUCTS);
    revalidateTag(CACHE_TAGS.CATEGORIES);
    revalidateTag(CACHE_TAG_FUNCTIONS.product(id));
    revalidatePath(ROUTES.HOME); // Обновляем главную страницу

    return result;
  } catch (error) {
    ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "updateProductAction");
    throw ErrorHandler.serverError(ERROR_MESSAGES.UPDATE_FAILED);
  }
}

// Удаление товара
export async function deleteProductAction(id: number) {
  try {
    const response = await fetch(API_URLS.PRODUCT_DETAIL(id), {
      ...createDeleteRequest(API_URLS.PRODUCT_DETAIL(id)),
    });

    if (!response.ok) {
      throw ErrorHandler.handleHttpError(response.status, ERROR_MESSAGES.DELETE_FAILED);
    }

    // Принудительное обновление кеша для немедленного эффекта
    revalidateTag(CACHE_TAGS.PRODUCTS);
    revalidateTag(CACHE_TAGS.CATEGORIES);
    revalidatePath(ROUTES.HOME); // Обновляем главную страницу

    return { success: true, deletedId: id };
  } catch (error) {
    ErrorHandler.logError(ErrorHandler.handleUnknownError(error), "deleteProductAction");
    throw ErrorHandler.serverError(ERROR_MESSAGES.DELETE_FAILED);
  }
}
