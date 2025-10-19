# Frontend Dev Test Task - Менеджер товаров

## Описание проекта

Тестовое задание на позицию **Frontend-разработчик (с ростом до Fullstack)**.

React-приложение "Менеджер товаров" для просмотра, добавления и редактирования данных о товарах. Реализовано с использованием современного стека технологий: Next.js 15, NestJS, Prisma и PostgreSQL.

## Технологический стек

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Server Actions** - для мутаций данных с автоматической ревалидацией
- **React Hook Form** - работа с формами
- **Встроенное кеширование** - fetch с revalidatePath/revalidateTag

### Backend
- **NestJS** - Node.js фреймворк
- **TypeScript** - типизация
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - база данных
- **Zod** - валидация данных и генерация типов
- **Swagger** - документация API

## Структура проекта

```
frontend-dev-test-task/
├── frontend/                 # Next.js приложение
│   ├── src/
│   │   ├── app/             # App Router страницы
│   │   ├── components/      # React компоненты
│   │   ├── lib/            # Утилиты и конфигурация
│   │   ├── services/        # API сервисы
│   │   ├── types/           # TypeScript типы
│   │   └── utils/           # Утилиты
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # NestJS приложение
│   ├── src/
│   │   ├── products/        # Модуль товаров
│   │   ├── prisma/          # Prisma схема и миграции
│   │   ├── common/          # Общие модули
│   │   └── main.ts          # Точка входа
│   ├── package.json
│   └── prisma/
└── README.md
```

## Функциональные требования

### Frontend (обязательная часть)
- [x] **Список товаров**
  - Отображение карточек товаров
  - Поля: изображение, название, цена, категория, рейтинг
  - Сортировка по цене (возрастание/убывание)
  - Сортировка по рейтингу

- [x] **Добавление товара**
  - Форма с полями: title, price, description, image URL, category
  - Выпадающий список категорий
  - Валидация полей
  - Обновление списка после добавления

- [x] **Просмотр и редактирование**
  - Модальное окно с полной информацией
  - Редактирование полей товара
  - Кнопка удаления товара
  - Сохранение изменений

### Backend (опциональная часть)
- [x] **API Endpoints**
  - `GET /api/products` - получение всех товаров
  - `GET /api/products/:id` - получение товара по ID
  - `POST /api/products` - создание нового товара
  - `PUT /api/products/:id` - обновление товара
  - `DELETE /api/products/:id` - удаление товара

- [x] **Технические требования**
  - CORS настройка
  - Валидация данных
  - TypeScript
  - Swagger документация

## Установка и запуск

### Предварительные требования
- Node.js 18+
- PostgreSQL (локально установленная)
- Git

### 1. Клонирование репозитория
```bash
git clone https://github.com/Morzh777/productsApp.git
cd frontend-dev-test-task
```

### 2. Установка зависимостей
```bash
npm run install:all
```

### 3. Настройка Backend

```bash
cd backend

# Настройка переменных окружения
cp .env.example .env

# Генерация Prisma клиента
npx prisma generate

# Выполнение миграций
npx prisma migrate dev

# Заполнение базы тестовыми данными
npx prisma db seed

# Запуск сервера
npm run start:dev
```

Backend будет доступен по адресу: http://localhost:3001
Swagger документация: http://localhost:3001/api

### 4. Настройка Frontend

```bash
cd frontend

# Запуск приложения
npm run dev
```

Frontend будет доступен по адресу: http://localhost:3000

### Быстрый запуск (все сразу)
```bash
# Запуск frontend и backend одновременно
npm run dev
```

## Переменные окружения

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/products_db"
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## API Документация

После запуска backend сервера, Swagger документация доступна по адресу:
http://localhost:3001/api

## Структура базы данных

### Таблица Products
```sql
CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "description" TEXT,
  "image" VARCHAR(500),
  "category" VARCHAR(100) NOT NULL,
  "rating" DECIMAL(3,2) DEFAULT 0.00,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Скрипты

### Корневые команды
```bash
npm run dev              # Запуск frontend и backend одновременно
npm run dev:frontend     # Запуск только frontend
npm run dev:backend      # Запуск только backend
npm run build            # Сборка всех проектов
npm run install:all      # Установка всех зависимостей
```

### Backend
```bash
npm run start          # Запуск в production режиме
npm run start:dev      # Запуск в development режиме
npm run build          # Сборка проекта
npm run test           # Запуск тестов
npm run prisma:studio  # Открытие Prisma Studio
```

### Frontend
```bash
npm run dev            # Запуск в development режиме
npm run build          # Сборка проекта
npm run start          # Запуск production сборки
npm run lint           # Проверка кода линтером
```

## Особенности реализации

### Frontend
- Использование App Router Next.js 15
- Server Actions для мутаций с автоматической ревалидацией
- Встроенное кеширование через fetch API
- React Hook Form для работы с формами
- Tailwind CSS для стилизации
- TypeScript для типизации
- Responsive дизайн

### Backend
- NestJS с модульной архитектурой
- Prisma ORM для работы с PostgreSQL
- Zod для валидации данных и генерации типов
- Swagger для документации API
- CORS настройка
- Error handling

## Новые возможности Next.js 15

### Server Actions с автоматической ревалидацией
```typescript
'use server'

import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  // Создание товара
  const product = await createProductInDB(formData)
  
  // Автоматическая ревалидация кеша
  revalidatePath('/products')
  return product
}
```

### Встроенное кеширование
```typescript
// Кеширование на 1 час
const products = await fetch('/api/products', {
  next: { revalidate: 3600 }
})

// Статическое кеширование
const staticData = await fetch('/api/categories', {
  cache: 'force-cache'
})
```

## Критерии оценки

- ✅ **Работоспособность**: Приложение запускается и работает по требованиям
- ✅ **Качество кода**: Чистота, читаемость, структура компонентов
- ✅ **UI/UX**: Аккуратность и понятность интерфейса
- ✅ **TypeScript**: Правильное использование типов
- ✅ **API Integration**: Корректная работа с backend
- ✅ **Документация**: Подробные инструкции по установке

## Дополнительные возможности

- Responsive дизайн для мобильных устройств
- Loading состояния и error handling
- Валидация форм на клиенте и сервере
- Swagger документация API
- Prisma Studio для управления данными

## Контакты

Для вопросов по проекту обращайтесь к разработчику.

---

**Время выполнения**: 4-6 часов  
**Статус**: ✅ Завершено  
**Автор**: Morzh777
