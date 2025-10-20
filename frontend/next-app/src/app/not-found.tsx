import Link from 'next/link';

/**
 * Страница "Страница не найдена" (404)
 * 
 * Особенности:
 * - Отображается при попытке доступа к несуществующим страницам
 * - Предоставляет пользователю понятное сообщение об ошибке
 * - Включает кнопку для возврата на главную страницу
 * - Использует дружелюбный дизайн для улучшения UX
 * - Следует принципам обработки ошибок навигации
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Код ошибки */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        {/* Заголовок ошибки */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Страница не найдена
        </h2>
        
        {/* Описание ошибки */}
        <p className="text-gray-600 mb-8">
          Извините, запрашиваемая страница не существует.
        </p>
        
        {/* Кнопка возврата на главную */}
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
