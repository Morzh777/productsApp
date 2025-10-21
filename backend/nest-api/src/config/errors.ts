/**
 * Централизованная система обработки ошибок для бекенда
 *
 * Типизированные ошибки, стандартные сообщения, HTTP коды и утилиты
 * для создания и обработки различных типов ошибок в NestJS.
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN',
}

export interface ApiError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: unknown;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string | number;
  public readonly details?: unknown;

  constructor(
    type: ErrorType,
    message: string,
    code?: string | number,
    details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
  }
}

/**
 * Стандартные сообщения об ошибках на русском языке
 */
export const ERROR_MESSAGES = {
  // Валидация
  VALIDATION_FAILED: 'Ошибка валидации данных',
  REQUIRED_FIELD: 'Обязательное поле не заполнено',
  INVALID_FORMAT: 'Неверный формат данных',
  INVALID_PRODUCT_DATA: 'Неверные данные товара',

  // База данных
  DATABASE_CONNECTION_ERROR: 'Ошибка подключения к базе данных',
  DATABASE_QUERY_ERROR: 'Ошибка выполнения запроса к базе данных',
  DATABASE_TIMEOUT: 'Превышено время ожидания запроса к базе данных',

  // CRUD операции
  PRODUCT_NOT_FOUND: 'Товар не найден',
  PRODUCTS_NOT_FOUND: 'Товары не найдены',
  CATEGORIES_NOT_FOUND: 'Категории не найдены',
  CREATE_FAILED: 'Не удалось создать товар',
  UPDATE_FAILED: 'Не удалось обновить товар',
  DELETE_FAILED: 'Не удалось удалить товар',

  // Сервер
  SERVER_ERROR: 'Ошибка сервера',
  INTERNAL_ERROR: 'Внутренняя ошибка сервера',
  SERVICE_UNAVAILABLE: 'Сервис недоступен',

  // Общие
  UNKNOWN_ERROR: 'Неизвестная ошибка',
  OPERATION_FAILED: 'Операция не выполнена',
} as const;

export const HTTP_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export class ErrorHandler {
  static validationError(
    message: string = ERROR_MESSAGES.VALIDATION_FAILED,
    details?: unknown,
  ): AppError {
    return new AppError(
      ErrorType.VALIDATION,
      message,
      'VALIDATION_ERROR',
      details,
    );
  }

  static notFoundError(
    message: string = ERROR_MESSAGES.PRODUCT_NOT_FOUND,
    details?: unknown,
  ): AppError {
    return new AppError(ErrorType.NOT_FOUND, message, 'NOT_FOUND', details);
  }

  static databaseError(
    message: string = ERROR_MESSAGES.DATABASE_QUERY_ERROR,
    details?: unknown,
  ): AppError {
    return new AppError(ErrorType.DATABASE, message, 'DATABASE_ERROR', details);
  }

  static serverError(
    message: string = ERROR_MESSAGES.SERVER_ERROR,
    details?: unknown,
  ): AppError {
    return new AppError(ErrorType.SERVER, message, 'SERVER_ERROR', details);
  }

  /**
   * Преобразует HTTP статус коды в соответствующие AppError объекты
   */
  static handleHttpError(status: number, message?: string): AppError {
    switch (status) {
      case HTTP_ERROR_CODES.BAD_REQUEST:
        return this.validationError(message || 'Неверный запрос');
      case HTTP_ERROR_CODES.UNAUTHORIZED:
        return new AppError(ErrorType.SERVER, 'Не авторизован', 'UNAUTHORIZED');
      case HTTP_ERROR_CODES.FORBIDDEN:
        return new AppError(ErrorType.SERVER, 'Доступ запрещен', 'FORBIDDEN');
      case HTTP_ERROR_CODES.NOT_FOUND:
        return this.notFoundError(message || ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      case HTTP_ERROR_CODES.CONFLICT:
        return new AppError(ErrorType.SERVER, 'Конфликт данных', 'CONFLICT');
      case HTTP_ERROR_CODES.UNPROCESSABLE_ENTITY:
        return this.validationError(message || 'Данные не прошли валидацию');
      case HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR:
        return this.serverError(message || ERROR_MESSAGES.INTERNAL_ERROR);
      case HTTP_ERROR_CODES.SERVICE_UNAVAILABLE:
        return new AppError(
          ErrorType.SERVER,
          ERROR_MESSAGES.SERVICE_UNAVAILABLE,
          'SERVICE_UNAVAILABLE',
        );
      default:
        return this.serverError(message || `Ошибка сервера: ${status}`);
    }
  }

  /**
   * Преобразует любые неизвестные ошибки в AppError объекты
   */
  static handleUnknownError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(
        ErrorType.UNKNOWN,
        error.message,
        'UNKNOWN_ERROR',
        error,
      );
    }

    return new AppError(
      ErrorType.UNKNOWN,
      ERROR_MESSAGES.UNKNOWN_ERROR,
      'UNKNOWN_ERROR',
      error,
    );
  }

  /**
   * Логирует ошибку с учетом окружения (development/production)
   */
  static logError(error: AppError, context?: string): void {
    // В production режиме логируем только критичные ошибки
    if (
      process.env.NODE_ENV === 'production' &&
      error.type === ErrorType.UNKNOWN
    ) {
      return;
    }

    const logMessage = context
      ? `[${context}] ${error.type}: ${error.message}`
      : `${error.type}: ${error.message}`;

    // Логируем только основное сообщение, без деталей
    console.error(logMessage);

    // Детали только в development
    if (process.env.NODE_ENV === 'development') {
      console.error('Details:', {
        code: error.code,
        details: error.details,
        stack: error.stack,
      });
    }
  }
}
