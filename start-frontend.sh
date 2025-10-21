#!/bin/bash

echo "🚀 Запуск Frontend (Next.js)"
echo "============================"

# Очищаем порт 3000 если он занят
echo "🧹 Проверяем порт 3000..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Порт 3000 занят, освобождаем..."
    # Получаем PID процесса на порту 3000 и убиваем его
    PID=$(lsof -ti :3000)
    if [ ! -z "$PID" ]; then
        kill $PID 2>/dev/null || true
        sleep 2
        echo "✅ Порт 3000 освобожден (PID: $PID)"
    fi
fi

# Переходим в папку frontend
cd frontend/next-app

# Проверяем наличие .env.local файла
if [ ! -f .env.local ]; then
    echo "📝 Создаем .env.local файл..."
    cat > .env.local << EOF
# Для работы без Nginx (прямое подключение к backend)
NEXT_PUBLIC_API_URL=http://localhost:3002/api

# Для работы с Nginx раскомментируйте строку ниже и закомментируйте строку выше:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api
EOF
    echo "✅ .env.local файл создан"
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

# Собираем frontend
echo "🔨 Собираем frontend..."
unset NODE_ENV
npm run build

# Запускаем в режиме продакшена
echo "🚀 Запускаем frontend на http://localhost:3000"
echo "🔗 Backend API: http://localhost:3002/api"
echo ""
npm run start
