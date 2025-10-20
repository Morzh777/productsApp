"use server";

import { revalidatePath } from "next/cache";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "@/shared/schemas/product.schema";

const API_BASE_URL = "http://localhost:3002/api";

// Создание товара
export async function createProductAction(formData: FormData) {
  const rawData = {
    title: formData.get("title") as string,
    price: Number(formData.get("price")),
    description: (formData.get("description") as string) || undefined,
    image: (formData.get("image") as string) || undefined,
    category: formData.get("category") as string,
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
  };

  // Валидация данных
  const validationResult = CreateProductSchema.safeParse(rawData);

  if (!validationResult.success) {
    throw new Error('Ошибка валидации данных');
  }

  const data = validationResult.data;

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка при создании товара");
    }

    revalidatePath("/products");
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    throw new Error("Не удалось создать товар");
  }
}

// Обновление товара
export async function updateProductAction(id: number, formData: FormData) {
  const rawData = {
    title: (formData.get("title") as string) || undefined,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    description: (formData.get("description") as string) || undefined,
    image: (formData.get("image") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
  };

  // Убираем пустые поля
  const filteredData = Object.fromEntries(
    Object.entries(rawData).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  );

  // Валидация данных
  const validationResult = UpdateProductSchema.safeParse(filteredData);

  if (!validationResult.success) {
    throw new Error('Ошибка валидации данных');
  }

  const data = validationResult.data;

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении товара");
    }

    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    throw new Error("Не удалось обновить товар");
  }
}

// Удаление товара
export async function deleteProductAction(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Ошибка при удалении товара");
    }

    revalidatePath("/products");
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    throw new Error("Не удалось удалить товар");
  }
}
