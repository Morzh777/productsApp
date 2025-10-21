#!/bin/bash

echo "🚀 Запуск Backend (NestJS) с локальной PostgreSQL"
echo "================================================="

# Проверяем и устанавливаем PostgreSQL
echo "🐘 Проверяем PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "📦 PostgreSQL не найден, устанавливаем..."
    if command -v brew &> /dev/null; then
        brew install postgresql@15
        echo "✅ PostgreSQL установлен через Homebrew"
    else
        echo "❌ Homebrew не найден. Установите PostgreSQL вручную."
        exit 1
    fi
else
    echo "✅ PostgreSQL уже установлен"
fi

# Добавляем PostgreSQL в PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Запускаем PostgreSQL сервис
echo "🔄 Запускаем PostgreSQL сервис..."
brew services start postgresql@15 2>/dev/null || true
sleep 3

# Создаем базу данных если не существует
echo "🗄️  Проверяем базу данных..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw productsapp; then
    echo "📝 Создаем базу данных productsapp..."
    createdb productsapp
    echo "✅ База данных productsapp создана"
else
    echo "✅ База данных productsapp уже существует"
fi

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

# Проверяем и обновляем .env файл для локальной базы
echo "📝 Настраиваем .env файл для локальной PostgreSQL..."
cat > .env << EOF
DATABASE_URL="postgresql://$(whoami)@localhost:5432/productsapp?schema=public"
PORT=3002
NODE_ENV=development
EOF
echo "✅ .env файл настроен для локальной базы"

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

# Генерируем Prisma клиент
echo "🔧 Генерируем Prisma клиент..."
npx prisma generate

# Применяем схему к базе данных
echo "🗄️  Применяем схему к базе данных..."
npx prisma db push

# Заполняем базу тестовыми данными
echo "🌱 Заполняем базу тестовыми данными..."
npm run db:seed

# Собираем проект
echo "🔨 Собираем backend..."
npm run build

# Запускаем в режиме разработки
echo "🚀 Запускаем backend на http://localhost:3002"
echo "📚 Swagger доступен на http://localhost:3002/api"
echo "🗄️  База данных: productsapp (локальная PostgreSQL)"
echo ""
npm run start:dev
