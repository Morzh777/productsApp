"use client";

import Link from 'next/link';

/**
 * Страница ошибки сервера (500)
 * 
 * Особенности:
 * - Отображается при возникновении серверных ошибок в приложении
 * - Предоставляет пользователю понятное сообщение об ошибке
 * - Включает кнопку для возврата на главную страницу
 * - Использует клиентский компонент для интерактивности
 * - Следует принципам UX для обработки ошибок
 */
export default function Error() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Код ошибки */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        
        {/* Заголовок ошибки */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Внутренняя ошибка сервера
        </h2>
        
        {/* Описание ошибки */}
        <p className="text-gray-600 mb-8">
          Произошла ошибка на сервере. Попробуйте обновить страницу.
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
