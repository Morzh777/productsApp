@echo off
setlocal enabledelayedexpansion

REM Set UTF-8 encoding for Russian text
chcp 65001 >nul 2>&1

REM Set console font for better Russian text display
powershell -Command "& {$Host.UI.RawUI.Font = New-Object System.Management.Automation.Host.Size(8, 16)}" >nul 2>&1

echo 🚀 Запуск Backend (NestJS) с локальной PostgreSQL
echo =================================================

REM Проверяем и устанавливаем PostgreSQL
echo 🐘 Проверяем PostgreSQL...
where psql >nul 2>&1
if errorlevel 1 (
    echo 📦 PostgreSQL не найден, устанавливаем...
    where choco >nul 2>&1
    if not errorlevel 1 (
        choco install postgresql --yes
        echo ✅ PostgreSQL установлен через Chocolatey
    ) else (
        echo ❌ Chocolatey не найден. Установите PostgreSQL вручную.
        echo 📥 Скачайте с https://www.postgresql.org/download/windows/
        pause
        exit /b 1
    )
) else (
    echo ✅ PostgreSQL уже установлен
)

REM Запускаем PostgreSQL сервис
echo 🔄 Запускаем PostgreSQL сервис...
net start postgresql-x64-15 >nul 2>&1 || net start postgresql-x64-14 >nul 2>&1 || net start postgresql-x64-13 >nul 2>&1 || echo ⚠️  PostgreSQL сервис уже запущен или не найден
timeout /t 3 /nobreak >nul

REM Создаем базу данных если не существует
echo 🗄️  Проверяем базу данных...
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='productsapp';" | findstr "1 row" >nul
if errorlevel 1 (
    echo 📝 Создаем базу данных productsapp...
    psql -U postgres -c "CREATE DATABASE productsapp;"
    echo ✅ База данных productsapp создана
) else (
    echo ✅ База данных productsapp уже существует
)

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

REM Проверяем и обновляем .env файл для локальной базы
echo 📝 Настраиваем .env файл для локальной PostgreSQL...
(
    echo DATABASE_URL="postgresql://postgres@localhost:5432/productsapp?schema=public"
    echo PORT=3002
    echo NODE_ENV=development
) > .env
echo ✅ .env файл настроен для локальной базы

REM Устанавливаем зависимости если нужно
if not exist node_modules (
    echo 📦 Устанавливаем зависимости...
    call npm install
)

REM Генерируем Prisma клиент
echo 🔧 Генерируем Prisma клиент...
call npx prisma generate

REM Применяем схему к базе данных
echo 🗄️  Применяем схему к базе данных...
call npx prisma db push

REM Заполняем базу тестовыми данными
echo 🌱 Заполняем базу тестовыми данными...
call npm run db:seed

REM Собираем проект
echo 🔨 Собираем backend...
call npm run build

REM Запускаем в режиме разработки
echo 🚀 Запускаем backend на http://localhost:3002
echo 📚 Swagger доступен на http://localhost:3002/api
echo 🗄️  База данных: productsapp (локальная PostgreSQL)
echo.
call npm run start:dev
