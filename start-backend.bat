@echo off
setlocal enabledelayedexpansion

REM Set UTF-8 encoding for Russian text
chcp 65001 >nul 2>&1

REM Set console font for better Russian text display
powershell -Command "& {$Host.UI.RawUI.Font = New-Object System.Management.Automation.Host.Size(8, 16)}" >nul 2>&1

echo 🚀 Запуск Backend (NestJS)
echo ==========================

REM Очищаем порт 3002 если он занят
echo 🧹 Проверяем порт 3002...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    echo ⚠️  Порт 3002 занят, освобождаем...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo ✅ Порт 3002 освобожден

REM Переходим в папку backend
cd backend\nest-api

REM Проверяем наличие .env файла
if not exist .env (
    echo 📝 Создаем .env файл...
           (
               echo DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=50&pool_timeout=60&connect_timeout=60"
               echo PORT=3002
               echo NODE_ENV=production
           ) > .env
    echo ✅ .env файл создан
)

REM Устанавливаем зависимости если нужно
if not exist node_modules (
    echo 📦 Устанавливаем зависимости...
    call npm install
)

REM Генерируем Prisma клиент
echo 🔧 Генерируем Prisma клиент...
call npx prisma generate

REM Запускаем в режиме продакшена
echo 🚀 Запускаем backend на http://localhost:3002
echo 📚 Swagger доступен на http://localhost:3002/swagger
echo.
call npm run start:prod
