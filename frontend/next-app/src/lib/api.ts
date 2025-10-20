import { ProductSchema, type Product } from '../shared/schemas/product.schema';

const API_BASE_URL = 'http://localhost:3002/api';

// Получение всех товаров
export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке товаров');
  }
  
  const data = await response.json();
  
  // Валидация ответа
  const validationResult = ProductSchema.array().safeParse(data);
  
  if (!validationResult.success) {
    console.error('Ошибка валидации товаров:', validationResult.error);
    throw new Error('Неверный формат данных товаров');
  }
  
  return validationResult.data;
}

// Получение списка категорий
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/products/categories`, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error('Ошибка при загрузке категорий');
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Неверный формат категорий');
  }
  return data.filter((c): c is string => typeof c === 'string');
}

// Получение товара по ID
export async function getProduct(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке товара');
  }
  
  const data = await response.json();
  
  // Валидация ответа
  const validationResult = ProductSchema.safeParse(data);
  
  if (!validationResult.success) {
    console.error('Ошибка валидации товара:', validationResult.error);
    throw new Error('Неверный формат данных товара');
  }
  
  return validationResult.data;
}

// Получение товаров по категории
export async function getProductsByCategory(category: string) {
  const response = await fetch(`${API_BASE_URL}/products?category=${category}`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке товаров');
  }
  
  const data = await response.json();
  
  // Валидация ответа
  const validationResult = ProductSchema.array().safeParse(data);
  
  if (!validationResult.success) {
    console.error('Ошибка валидации товаров:', validationResult.error);
    throw new Error('Неверный формат данных товаров');
  }
  
  return validationResult.data;
}

// Обновление товара
export async function updateProduct(id: number, updates: Partial<Product>) {
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
  
  return validationResult.data;
}

// Удаление товара
export async function deleteProduct(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Ошибка при удалении товара');
  }
  
  return true;
}