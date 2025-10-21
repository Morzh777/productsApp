# Products App - Менеджер товаров

Полнофункциональное React-приложение для управления товарами с современной архитектурой и декомпозированными компонентами.

## Технологический стек

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Server Actions, Zod, Headless UI  
**Backend:** NestJS, TypeScript, Prisma, PostgreSQL, Zod, Swagger  
**Infrastructure:** Nginx

## База данных

> **Важно:** Приложение использует **локальную PostgreSQL** базу данных для быстрой и надежной работы.  
> Скрипты автоматически установят и настроят PostgreSQL при первом запуске.

### Автоматическая настройка

Скрипты запуска автоматически:
- 🐘 **Устанавливают PostgreSQL** (через Homebrew на macOS/Linux, Chocolatey на Windows)
- 🔄 **Запускают PostgreSQL сервис**
- 🗄️ **Создают базу данных** `productsapp`
- 📝 **Настраивают подключение** в `.env` файле
- 🔧 **Применяют схему** базы данных
- 🌱 **Заполняют тестовыми данными** (20 товаров)

### Ручная настройка PostgreSQL

Если автоматическая установка не работает:

#### macOS/Linux
```bash
# Установка через Homebrew
brew install postgresql@15
brew services start postgresql@15

# Создание базы данных
createdb productsapp
```

#### Windows

**Вариант 1: Через Chocolatey (если установлен)**
```bash
choco install postgresql --yes
```

**Вариант 2: Ручная установка (рекомендуется)**
1. Скачайте PostgreSQL с https://www.postgresql.org/download/windows/
2. Запустите установщик и следуйте инструкциям
3. Запомните пароль для пользователя `postgres`
4. После установки создайте базу данных:
```bash
psql -U postgres -c "CREATE DATABASE productsapp;"
```

> **Примечание:** Если скрипт не может установить PostgreSQL автоматически, он покажет ссылку для ручной установки.

### Преимущества локальной PostgreSQL

- ⚡ **Быстрее** - нет сетевых задержек
- 🔒 **Надежнее** - не зависит от интернета
- 💰 **Бесплатно** - нет лимитов на запросы
- 🛠️ **Полный контроль** - можете делать что угодно с базой
- 🔧 **Простая отладка** - прямой доступ к данным
- 📊 **Локальные инструменты** - pgAdmin, DBeaver и др.

## Быстрый запуск

### Вариант 1: Без Nginx (простой запуск)

```bash
# Клонируйте репозиторий
git clone https://github.com/Morzh777/productsApp.git
cd productsApp

# Запустите backend (в отдельном терминале)
# Для Unix-систем (macOS, Linux):
./start-backend.sh

# Для Windows:
start-backend.bat

# Запустите frontend (в другом терминале)
# Для Unix-систем (macOS, Linux):
./start-frontend.sh

# Для Windows:
start-frontend.bat
```

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:3002/api  
**Swagger:** http://localhost:3002/swagger

### Вариант 2: С Nginx (полная настройка)

```bash
# Клонируйте репозиторий
git clone https://github.com/Morzh777/productsApp.git
cd productsApp

# Запустите все сервисы с Nginx (Unix-системы)
./start-with-nginx.sh
```

**Frontend:** http://localhost:8080  
**Backend API:** http://localhost:8080/api  
**Swagger:** http://localhost:8080/swagger

## Примечания для Windows

### Проблемы с Turbopack
Если возникает ошибка `Turbopack Error: FileSystemPath leaves the filesystem root`:
1. Turbopack автоматически отключен в конфигурации Next.js
2. Windows скрипты используют команду `npm run dev:windows` без Turbopack
3. Если проблема остается, запустите вручную: `npm run dev:windows`

### Проблемы с кодировкой
Если русский текст отображается некорректно в терминале:
1. Убедитесь, что терминал поддерживает UTF-8 кодировку
2. В PowerShell выполните: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`

### Проблемы с PostgreSQL на Windows

**Если скрипт не может установить PostgreSQL:**
1. Скачайте PostgreSQL вручную с https://www.postgresql.org/download/windows/
2. Запустите установщик от имени администратора
3. Выберите все компоненты (включая pgAdmin)
4. Запомните пароль для пользователя `postgres`
5. После установки перезапустите скрипт

**Если PostgreSQL не запускается:**
```bash
# Проверьте статус сервиса
sc query postgresql-x64-15

# Запустите сервис вручную
net start postgresql-x64-15
```

**Если не работает команда `psql`:**
1. Добавьте PostgreSQL в PATH: `C:\Program Files\PostgreSQL\15\bin`
2. Или используйте полный путь: `"C:\Program Files\PostgreSQL\15\bin\psql.exe"`

> **Примечание:** Скрипты автоматически создают .env файлы и устанавливают зависимости при первом запуске. При работе без Nginx запускайте backend и frontend в разных терминалах.

## Функциональность

- ✅ **Список товаров** с сортировкой по цене, рейтингу и дате
- ✅ **Добавление товаров** с валидацией форм и модальными окнами
- ✅ **Редактирование и удаление** товаров с подтверждением
- ✅ **Фильтрация по категориям** с интерактивными тегами
- ✅ **Детальная страница товара** с полной информацией
- ✅ **Responsive дизайн** для всех устройств
- ✅ **Декомпозированная архитектура** с переиспользуемыми компонентами
- ✅ **Централизованная обработка ошибок** и валидация
- ✅ **Swagger документация** API

## Структура проекта

```
productsApp/
├── frontend/next-app/     # Next.js приложение
└── backend/nest-api/      # NestJS API
```

## Переменные окружения

> **Примечание:** Скрипты автоматически создают файлы .env с настройками для локальной PostgreSQL

### Backend (.env)
```env
# Подключение к локальной PostgreSQL
DATABASE_URL="postgresql://username@localhost:5432/productsapp?schema=public"
PORT=3002
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Ручная установка

Если автоматические скрипты не работают, можно установить проект вручную:

### Требования
- **Node.js 18+** - https://nodejs.org/
- **PostgreSQL 13+** - https://www.postgresql.org/download/
  - **Windows:** Скачайте с официального сайта или установите Chocolatey
  - **macOS:** `brew install postgresql@15`
  - **Linux:** `sudo apt install postgresql` (Ubuntu/Debian)
- **Nginx** - https://nginx.org/en/download.html (опционально)
- **Git** - https://git-scm.com/

### Установка зависимостей

```bash
# Клонируйте репозиторий
git clone https://github.com/Morzh777/productsApp.git
cd productsApp

# Установите корневые зависимости
npm install

# Установите backend зависимости
cd backend/nest-api
npm install

# Установите frontend зависимости
cd ../../frontend/next-app
npm install
```

### Настройка окружения

#### Backend (.env)
```env
# Подключение к локальной PostgreSQL
DATABASE_URL="postgresql://username@localhost:5432/productsapp?schema=public"
PORT=3002
NODE_ENV=development
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Настройка базы данных

```bash
cd backend/nest-api

# Генерация Prisma клиента
npx prisma generate

# Применение схемы к базе данных
npx prisma db push

# Заполнение тестовыми данными
npm run db:seed
```

> **Примечание:** Убедитесь, что PostgreSQL запущен и база данных `productsapp` создана.

### Настройка Nginx

1. **Скачайте Nginx** с https://nginx.org/en/download.html
2. **Распакуйте** в `C:\nginx` (Windows) или `/usr/local/nginx` (Unix)
3. **Скопируйте** `nginx.conf` из корня проекта в папку конфигурации Nginx
4. **Добавьте Nginx в PATH** или используйте полный путь

### Запуск приложения

```bash
# Сборка backend
cd backend/nest-api
npm run build
npm run start:prod &

# Сборка и запуск frontend
cd ../../frontend/next-app
npm run build
npm run start &

# Запуск Nginx
nginx -c /path/to/nginx.conf
```

## Основные команды

```bash
# Запуск backend (разработка)
cd backend/nest-api && npm run start:dev

# Запуск frontend (разработка)  
cd frontend/next-app && npm run dev

# Сборка backend (production)
cd backend/nest-api && npm run build && npm run start:prod

# Сборка frontend (production)
cd frontend/next-app && npm run build && npm run start
```

## Архитектура компонентов

### UI Компоненты
- **ProductCard** - карточка товара с изображением, рейтингом и ценой
- **ProductImage** - изображение товара с fallback и поддержкой children
- **StarRating** - звездный рейтинг с пиксельными изображениями
- **CategoryTag** - интерактивный тег категории с фильтрацией
- **SortSelect** - выбор сортировки с Headless UI
- **Button** - универсальная кнопка с множественными вариантами

### Формы и модальные окна
- **ProductForm** - декомпозированная форма товара с валидацией
- **CreateModal/EditModal/DeleteModal** - модальные окна для CRUD операций
- **FormActions** - кнопки действий формы
- **TextField/NumberField/TextAreaField/CategoryField** - переиспользуемые поля

### Утилиты и хуки
- **useProductForm** - хук для управления состоянием формы
- **useProductQueryState** - синхронизация состояния с URL параметрами
- **ErrorHandler** - централизованная обработка ошибок
- **Zod схемы** - валидация данных на клиенте и сервере

## Особенности архитектуры

- **Nginx** - проксирование запросов с сжатием (кеширование отключено)
- **Декомпозированные компоненты** - модульная архитектура с переиспользуемыми частями
- **Server Actions** с автоматической ревалидацией кеша
- **Централизованная валидация** через Zod схемы
- **Кастомные хуки** для управления состоянием форм и URL параметров
- **Headless UI** для доступных интерактивных компонентов
- **Централизованная обработка ошибок** с типизированными исключениями
- **TypeScript** для полной типизации на всех уровнях
- **Prisma ORM** для работы с PostgreSQL
- **Адаптивный дизайн** с Tailwind CSS
- **Модальные окна** для создания, редактирования и удаления товаров

---

**Автор:** Morzh777