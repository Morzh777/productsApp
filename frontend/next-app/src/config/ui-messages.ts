/**
 * Константы для UI сообщений
 * 
 * Централизованная коллекция всех текстовых сообщений интерфейса
 * на русском языке для обеспечения консистентности и упрощения локализации.
 */

export const PRODUCT_MESSAGES = {
  NO_IMAGE: "Нет изображения",
  NO_PRODUCTS_FOUND: "Товары не найдены",
  ADD_PRODUCTS_TO_VIEW: "Добавьте товары для просмотра",
  SHOWING_PRODUCTS: "Показано",
  OF_PRODUCTS: "из",
  PRODUCTS_COUNT: "товаров",
} as const;

export const NAVIGATION_MESSAGES = {
  HOME: "Главная",
  PRODUCTS: "Товары",
  BACK: "Назад",
  EDIT: "Редактировать",
  ADD: "Добавить Товар",
} as const;

export const FORM_MESSAGES = {
  PRODUCT_TITLE: "Название товара",
  PRICE: "Цена ($)",
  DESCRIPTION: "Описание",
  CATEGORY: "Категория",
  RATING: "Рейтинг (0-5)",
  REVIEWS_COUNT: "Количество отзывов",
  IMAGE_URL: "URL изображения",
  SAVE: "Сохранить",
  CANCEL: "Отмена",
  DELETE: "Удалить",
  DELETING: "Удаление...",
  ADDING: "Добавление...",
  ADD_PRODUCT: "Добавить товар",
  EDIT_PRODUCT: "Редактировать товар",
  DELETE_CONFIRMATION: "Подтверждение удаления",
  DELETE_CONFIRM_TEXT: "Вы уверены, что хотите удалить товар",
  DELETE_WARNING: "Это действие нельзя отменить.",
} as const;

export const SORT_MESSAGES = {
  SORT_BY: "Сортировать:",
  NEWEST: "Новые",
  PRICE_ASC: "Цена: по возрастанию",
  PRICE_DESC: "Цена: по убыванию",
  RATING: "По рейтингу",
} as const;

export const PLACEHOLDERS = {
  PRODUCT_TITLE: "Введите название товара",
  PRICE: "0.00",
  DESCRIPTION: "Введите описание товара",
  CATEGORY: "Выберите или введите",
  RATING: "4.5",
  REVIEWS_COUNT: "120",
  IMAGE_URL: "https://example.com/image.jpg",
} as const;

export const MODAL_MESSAGES = {
  ADD_NEW_CATEGORY: "Добавить новую:",
  OPEN_CATEGORIES: "Открыть список категорий",
} as const;
