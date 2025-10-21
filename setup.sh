#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Products App - Автоматическая установка${NC}"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен. Установите Node.js 18+ и попробуйте снова.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Требуется Node.js 18+. Текущая версия: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) найден${NC}"

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}📦 Nginx не установлен. Устанавливаем...${NC}"
    
    # Detect OS and install nginx
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install nginx
        else
            echo -e "${RED}❌ Homebrew не найден. Установите Nginx вручную: brew install nginx${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y nginx
        elif command -v yum &> /dev/null; then
            sudo yum install -y nginx
        else
            echo -e "${RED}❌ Не удалось определить пакетный менеджер. Установите Nginx вручную.${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Неподдерживаемая операционная система. Установите Nginx вручную.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Nginx найден${NC}"

# Install root dependencies (local installation)
echo -e "${YELLOW}📦 Устанавливаем корневые зависимости (локально)...${NC}"
npm install --no-global

# Install backend dependencies (local installation)
echo -e "${YELLOW}📦 Устанавливаем зависимости backend (локально)...${NC}"
cd backend/nest-api
npm install --no-global

# Create backend .env file (production)
echo -e "${YELLOW}⚙️  Создаем .env файл для backend (production)...${NC}"
cat > .env << EOF
DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=5&pool_timeout=20&connect_timeout=60"
PORT=3002
NODE_ENV=production
EOF

echo -e "${GREEN}✅ .env файл создан для backend${NC}"

# Generate Prisma client
echo -e "${YELLOW}🔧 Генерируем Prisma клиент...${NC}"
npx prisma generate

# Run migrations
echo -e "${YELLOW}🗄️  Выполняем миграции базы данных...${NC}"
npx prisma migrate deploy

# Build backend
echo -e "${YELLOW}🏗️  Сборка backend (production)...${NC}"
npm run build

echo -e "${GREEN}✅ Backend настроен и готов к работе${NC}"

# Install frontend dependencies (local installation)
echo -e "${YELLOW}📦 Устанавливаем зависимости frontend (локально)...${NC}"
cd ../../frontend/next-app
npm install --no-global

# Create frontend .env.local file
echo -e "${YELLOW}⚙️  Создаем .env.local файл для frontend...${NC}"
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080/api
EOF

echo -e "${GREEN}✅ .env.local файл создан для frontend${NC}"

# Setup Nginx
echo -e "${YELLOW}⚙️  Настраиваем Nginx...${NC}"

# Go back to root directory for nginx config
cd ../..

# Test nginx config
echo -e "${YELLOW}🔍 Проверяем конфигурацию Nginx...${NC}"
if nginx -t -c $(pwd)/nginx.conf; then
    echo -e "${GREEN}✅ Конфигурация Nginx корректна${NC}"
else
    echo -e "${RED}❌ Ошибка в конфигурации Nginx${NC}"
    exit 1
fi

# Start nginx with our config (port 80 requires sudo)
echo -e "${YELLOW}🧹 Останавливаем ранее запущенный Nginx (если есть)...${NC}"
nginx -s stop 2>/dev/null || true
if lsof -i :8080 >/dev/null 2>&1; then
  PID=$(lsof -ti :8080 | head -n1)
  if [ -n "$PID" ]; then kill -9 $PID 2>/dev/null || true; fi
fi

echo -e "${YELLOW}🚀 Запускаем Nginx...${NC}"
nginx -c $(pwd)/nginx.conf &
NGINX_PID=$!

echo -e "${GREEN}✅ Nginx запущен${NC}"

echo ""
echo -e "${GREEN}🎉 Установка завершена успешно!${NC}"
echo ""
echo -e "${BLUE}📋 Что было сделано:${NC}"
echo "  ✅ Установлены все зависимости"
echo "  ✅ Настроены .env файлы"
echo "  ✅ Выполнены миграции базы данных"
echo "  ✅ Настроен и запущен Nginx"
echo ""
echo -e "${BLUE}🚀 Запускаем приложение...${NC}"
echo ""
echo -e "${BLUE}📱 Приложение будет доступно по адресам:${NC}"
echo "  🌐 Основной сайт: ${GREEN}http://localhost:8080${NC}"
echo "  🔧 API:         ${GREEN}http://localhost:8080/api${NC}"
echo "  📚 Swagger:     ${GREEN}http://localhost:8080/swagger${NC}"
echo ""
echo -e "${YELLOW}💡 Для остановки нажмите Ctrl+C${NC}"
echo ""

# Start backend in background (production)
cd backend/nest-api
echo -e "${YELLOW}🧹 Освобождаем порт 3002 (если занят)...${NC}"
if lsof -i :3002 >/dev/null 2>&1; then
  BPID=$(lsof -ti :3002 | head -n1)
  if [ -n "$BPID" ]; then kill -9 $BPID 2>/dev/null || true; fi
fi
if [ ! -f dist/src/main.js ]; then
  echo -e "${YELLOW}🏗️  Не найден dist/src/main.js — выполняю сборку backend...${NC}"
  npm run build
fi
npm run start:prod &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Build and start frontend (production)
cd ../../frontend/next-app
echo -e "${YELLOW}🏗️  Сборка frontend (production)...${NC}"
npm run build
echo -e "${YELLOW}🚀 Запуск frontend (production)...${NC}"
npm run start &
FRONTEND_PID=$!

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Останавливаем серверы...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill $NGINX_PID 2>/dev/null
    echo -e "${GREEN}✅ Серверы остановлены${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
