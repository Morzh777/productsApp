@echo off
setlocal enabledelayedexpansion

REM Set UTF-8 encoding for Russian text
chcp 65001 >nul 2>&1

REM Set console font for better Russian text display
powershell -Command "& {$Host.UI.RawUI.Font = New-Object System.Management.Automation.Host.Size(8, 16)}" >nul 2>&1

echo 🚀 Запуск приложения с Nginx
echo =============================

REM Очищаем порты 3000, 3002 и 8080 если они заняты
echo 🧹 Проверяем порты...
for %%p in (3000 3002 8080) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
        echo ⚠️  Порт %%p занят, освобождаем...
        taskkill /PID %%a /F >nul 2>&1
        echo ✅ Порт %%p освобожден (PID: %%a)
    )
)
timeout /t 2 /nobreak >nul

REM Проверяем, установлен ли Nginx
where nginx >nul 2>&1
if errorlevel 1 (
    echo ❌ Nginx не найден. Установите Nginx и повторите попытку.
    echo 📥 Скачайте с https://nginx.org/en/download.html
    echo 💡 Или установите через Chocolatey: choco install nginx
    pause
    exit /b 1
)

REM Запускаем backend в фоне
echo 🚀 Запускаем backend...
cd backend\nest-api

REM Создаем .env файл если его нет
if not exist .env (
    echo 📝 Создаем .env файл...
    (
        echo DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=100&pool_timeout=120&connect_timeout=120"
        echo PORT=3002
        echo NODE_ENV=production
    ) > .env
    echo ✅ .env файл создан
)

REM Устанавливаем зависимости если нужно
if not exist node_modules (
    echo 📦 Устанавливаем зависимости backend...
    call npm install
)

REM Генерируем Prisma клиент
echo 🔧 Генерируем Prisma клиент...
call npx prisma generate

REM Собираем backend
echo 🔨 Собираем backend...
call npm run build

REM Запускаем backend в фоне
echo 🚀 Запускаем backend в фоне...
start /B cmd /c "npm run start:prod"
timeout /t 5 /nobreak >nul

REM Возвращаемся в корень проекта
cd ..\..

REM Запускаем Nginx
echo 🚀 Запускаем Nginx...
nginx -c "%CD%\nginx.conf"

REM Запускаем frontend
echo 🚀 Запускаем frontend...
cd frontend\next-app

REM Создаем .env.local файл для работы с Nginx
if not exist .env.local (
    echo 📝 Создаем .env.local файл для Nginx...
    (
        echo # Для работы с Nginx
        echo NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ) > .env.local
    echo ✅ .env.local файл создан
)

REM Устанавливаем зависимости если нужно
if not exist node_modules (
    echo 📦 Устанавливаем зависимости frontend...
    call npm install
)

REM Собираем frontend
echo 🔨 Собираем frontend...
set NODE_ENV=
call npm run build

REM Запускаем frontend в режиме продакшена
echo 🚀 Запускаем frontend...
start /B cmd /c "npm run start"

echo.
echo 🎉 Приложение запущено!
echo 🌐 Frontend: http://localhost:8080
echo 🔗 Backend API: http://localhost:8080/api
echo 📚 Swagger: http://localhost:8080/swagger
echo.
echo Для остановки нажмите любую клавишу...

pause >nul

REM Останавливаем процессы
echo.
echo 🛑 Останавливаем приложение...
taskkill /F /IM nginx.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Приложение остановлено
