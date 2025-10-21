@echo off
setlocal enabledelayedexpansion

echo 🚀 Products App - Автоматическая установка для Windows
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен. Установите Node.js 18+ и попробуйте снова.
    pause
    exit /b 1
)

echo ✅ Node.js найден

REM Check if nginx is installed
nginx --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Nginx не установлен. Установите Nginx вручную:
    echo   1. Скачайте Nginx с https://nginx.org/en/download.html
    echo   2. Распакуйте в C:\nginx
    echo   3. Добавьте C:\nginx в PATH
    echo   4. Запустите скрипт снова
    echo.
    echo 💡 Или используйте WSL для автоматической установки
    pause
    exit /b 1
)

echo ✅ Nginx найден

REM Install root dependencies
echo 📦 Устанавливаем корневые зависимости...
call npm install

REM Install backend dependencies
echo 📦 Устанавливаем зависимости backend...
cd backend\nest-api
call npm install

REM Create backend .env file (production)
echo ⚙️  Создаем .env файл для backend (production)...
(
echo DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=5&pool_timeout=20&connect_timeout=60"
echo PORT=3002
echo NODE_ENV=production
) > .env

echo ✅ .env файл создан для backend

REM Generate Prisma client
echo 🔧 Генерируем Prisma клиент...
call npx prisma generate

REM Run migrations
echo 🗄️  Выполняем миграции базы данных...
call npx prisma migrate deploy

REM Build backend
echo 🏗️  Сборка backend (production)...
call npm run build

echo ✅ Backend настроен и готов к работе

REM Install frontend dependencies
echo 📦 Устанавливаем зависимости frontend...
cd ..\..\frontend\next-app
call npm install

REM Create frontend .env.local file
echo ⚙️  Создаем .env.local файл для frontend...
(
echo NEXT_PUBLIC_API_URL=http://localhost:8080/api
) > .env.local

echo ✅ .env.local файл создан для frontend

REM Setup Nginx
echo ⚙️  Настраиваем Nginx...

REM Go back to root directory for nginx config
cd ..\..

REM Test nginx config
echo 🔍 Проверяем конфигурацию Nginx...
nginx -t -c "%cd%\nginx.conf"
if %errorlevel% neq 0 (
    echo ❌ Ошибка в конфигурации Nginx
    pause
    exit /b 1
)

echo ✅ Конфигурация Nginx корректна

REM Check if port 8080 is in use
echo 🧹 Проверяем порт 8080...
netstat -ano | findstr :8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Порт 8080 занят. Освободите его вручную и запустите скрипт снова.
    pause
    exit /b 1
)

REM Start nginx
echo 🚀 Запускаем Nginx...
start /b nginx -c "%cd%\nginx.conf"

echo ✅ Nginx запущен

echo.
echo 🎉 Установка завершена успешно!
echo.
echo 📋 Что было сделано:
echo   ✅ Установлены все зависимости
echo   ✅ Настроены .env файлы
echo   ✅ Выполнены миграции базы данных
echo   ✅ Настроен и запущен Nginx
echo.
echo 🚀 Запускаем приложение...
echo.
echo 📱 Приложение будет доступно по адресам:
echo   🌐 Основной сайт: http://localhost:8080
echo   🔧 API:         http://localhost:8080/api
echo   📚 Swagger:     http://localhost:8080/swagger
echo.
echo 💡 Для остановки закройте это окно
echo.

REM Start backend in background (production)
cd backend\nest-api
echo 🧹 Проверяем порт 3002...
netstat -ano | findstr :3002 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Порт 3002 занят. Освободите его вручную и запустите скрипт снова.
    pause
    exit /b 1
)

if not exist "dist\src\main.js" (
    echo 🏗️  Не найден dist\src\main.js — выполняю сборку backend...
    call npm run build
)

echo 🚀 Запуск backend (production)...
start /b npm run start:prod

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Build and start frontend (production)
cd ..\..\frontend\next-app
echo 🏗️  Сборка frontend (production)...
call npm run build
echo 🚀 Запуск frontend (production)...
start /b npm run start

echo.
echo ✅ Приложение запущено!
echo 💡 Для остановки закройте это окно или нажмите Ctrl+C
echo.

pause
