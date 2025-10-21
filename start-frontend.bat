@echo off
setlocal enabledelayedexpansion

echo 🚀 Запуск Frontend (Next.js)
echo =============================

REM Очищаем порт 3000 если он занят
echo 🧹 Проверяем порт 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo ⚠️  Порт 3000 занят, освобождаем...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo ✅ Порт 3000 освобожден

REM Переходим в папку frontend
cd frontend\next-app

REM Проверяем наличие .env.local файла
if not exist .env.local (
    echo 📝 Создаем .env.local файл...
    (
        echo # Для работы без Nginx (прямое подключение к backend)
        echo NEXT_PUBLIC_API_URL=http://localhost:3002/api
        echo.
        echo # Для работы с Nginx раскомментируйте строку ниже и закомментируйте строку выше:
        echo # NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ) > .env.local
    echo ✅ .env.local файл создан
)

REM Устанавливаем зависимости если нужно
if not exist node_modules (
    echo 📦 Устанавливаем зависимости...
    call npm install
)

REM Запускаем в режиме разработки
echo 🚀 Запускаем frontend на http://localhost:3000
echo 🔗 Backend API: http://localhost:3002/api
echo.
call npm run dev
