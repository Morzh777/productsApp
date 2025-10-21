/**
 * README для конфигурации бекенда
 * 
 * Структура папки config и описание файлов конфигурации.
 */

/**
 * Структура файлов:
 * 
 * /config/
 * ├── routes.ts         # Конфигурация роутов API
 * ├── errors.ts         # Система обработки ошибок
 * ├── database.ts       # Конфигурация базы данных и Prisma
 * └── app.ts           # Общие настройки приложения
 */

/**
 * Использование:
 * 
 * Импорт конкретных модулей:
 * import { API_ROUTES } from './config/routes';
 * import { ERROR_MESSAGES } from './config/errors';
 * import { DATABASE_CONFIG } from './config/database';
 * import { SERVER_CONFIG } from './config/app';
 */

/**
 * Преимущества:
 * 
 * 1. Централизованное управление константами
 * 2. Типобезопасность через TypeScript
 * 3. Легкость изменения настроек
 * 4. Консистентность между модулями
 * 5. Удобство тестирования
 */
