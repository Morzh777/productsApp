#!/bin/bash

echo "🚀 Запуск приложения с Nginx"
echo "============================="

# Очищаем порты 3000, 3002 и 8080 если они заняты
echo "🧹 Проверяем порты..."
for port in 3000 3002 8080; do
    if lsof -i :$port > /dev/null 2>&1; then
        echo "⚠️  Порт $port занят, освобождаем..."
        case $port in
            3000) pkill -f "next.*3000" 2>/dev/null || true ;;
            3002) pkill -f "nest-api" 2>/dev/null || true ;;
            8080) nginx -s stop 2>/dev/null || true ;;
        esac
        sleep 1
        echo "✅ Порт $port освобожден"
    fi
done

# Проверяем, установлен ли Nginx
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx не установлен. Установите Nginx и повторите попытку."
    echo "   macOS: brew install nginx"
    echo "   Ubuntu/Debian: sudo apt install nginx"
    echo "   CentOS/RHEL: sudo yum install nginx"
    exit 1
fi

# Запускаем backend в фоне
echo "🚀 Запускаем backend..."
cd backend/nest-api

# Создаем .env файл если его нет
if [ ! -f .env ]; then
    echo "📝 Создаем .env файл..."
    cat > .env << EOF
DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=5&pool_timeout=20&connect_timeout=60"
PORT=3002
NODE_ENV=development
EOF
    echo "✅ .env файл создан"
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости backend..."
    npm install
fi

# Генерируем Prisma клиент
echo "🔧 Генерируем Prisma клиент..."
npx prisma generate

# Запускаем backend в фоне
npm run start:dev &
BACKEND_PID=$!

# Возвращаемся в корень проекта
cd ../..

# Ждем запуска backend
echo "⏳ Ждем запуска backend..."
sleep 5

# Запускаем Nginx
echo "🚀 Запускаем Nginx..."
nginx -c $(pwd)/nginx.conf

# Запускаем frontend
echo "🚀 Запускаем frontend..."
cd frontend/next-app

# Создаем .env.local файл для работы с Nginx
if [ ! -f .env.local ]; then
    echo "📝 Создаем .env.local файл для Nginx..."
    cat > .env.local << EOF
# Для работы с Nginx
NEXT_PUBLIC_API_URL=http://localhost:8080/api
EOF
    echo "✅ .env.local файл создан"
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости frontend..."
    npm install
fi

echo ""
echo "🎉 Приложение запущено!"
echo "🌐 Frontend: http://localhost:8080"
echo "🔗 Backend API: http://localhost:8080/api"
echo "📚 Swagger: http://localhost:8080/swagger"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Функция для корректного завершения
cleanup() {
    echo ""
    echo "🛑 Останавливаем приложение..."
    kill $BACKEND_PID 2>/dev/null
    nginx -s stop
    echo "✅ Приложение остановлено"
    exit 0
}

# Перехватываем сигнал завершения
trap cleanup SIGINT SIGTERM

# Запускаем frontend
npm run dev
