# Products App - Менеджер товаров

Полнофункциональное React-приложение для управления товарами с современной архитектурой и декомпозированными компонентами.

## Технологический стек

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Server Actions, Zod, Headless UI  
**Backend:** NestJS, TypeScript, Prisma, PostgreSQL, Zod, Swagger  
**Infrastructure:** Nginx

## База данных

> **Важно:** База данных PostgreSQL уже развернута на сервере **Neon** и готова к использованию.  
> Локальная установка PostgreSQL не требуется - приложение подключается к облачной базе данных.

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

> **Примечание:** При использовании `./setup.sh` файлы .env создаются автоматически

### Backend (.env)
```env
# Подключение к облачной базе данных Neon
DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=5&pool_timeout=20&connect_timeout=60"
PORT=3002
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Ручная установка

Если автоматические скрипты не работают, можно установить проект вручную:

### Требования
- **Node.js 18+** - https://nodejs.org/
- **Nginx** - https://nginx.org/en/download.html
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
DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=5&pool_timeout=20&connect_timeout=60"
PORT=3002
NODE_ENV=production
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
```

> **Примечание:** База данных уже настроена в облаке Neon, миграции выполнять не нужно.

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