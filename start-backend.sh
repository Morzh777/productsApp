#!/bin/bash

echo "🚀 Запуск Backend (NestJS)"
echo "=========================="

# Очищаем порт 3002 если он занят
echo "🧹 Проверяем порт 3002..."
if lsof -i :3002 > /dev/null 2>&1; then
    echo "⚠️  Порт 3002 занят, освобождаем..."
    pkill -f "nest-api" 2>/dev/null || true
    pkill -f "node.*3002" 2>/dev/null || true
    sleep 2
    echo "✅ Порт 3002 освобожден"
fi

# Переходим в папку backend
cd backend/nest-api

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "📝 Создаем .env файл..."
           cat > .env << EOF
DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=50&pool_timeout=60&connect_timeout=60"
PORT=3002
NODE_ENV=production
EOF
    echo "✅ .env файл создан"
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

# Генерируем Prisma клиент
echo "🔧 Генерируем Prisma клиент..."
npx prisma generate

# Запускаем в режиме продакшена
echo "🚀 Запускаем backend на http://localhost:3002"
echo "📚 Swagger доступен на http://localhost:3002/swagger"
echo ""
npm run start:prod
