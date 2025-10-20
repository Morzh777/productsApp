/**
 * Интерфейс данных формы продукта
 */
export interface FormData {
  title: string;
  price: string;
  description: string;
  category: string;
  rating: string;
  count: string;
  image: string;
}

/**
 * Интерфейс ошибок формы
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * Результат валидации формы
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Пропсы компонента кнопок формы
 */
export interface FormActionsProps {
  onDelete?: () => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  submitLabel?: string;
}
