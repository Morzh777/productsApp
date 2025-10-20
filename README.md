# Products App - Менеджер товаров

React-приложение для управления товарами 

## Технологический стек

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Server Actions, Zod  
**Backend:** NestJS, TypeScript, Prisma, PostgreSQL, Zod, Swagger

## База данных

> **Важно:** База данных PostgreSQL уже развернута на сервере **Neon** и готова к использованию.  
> Локальная установка PostgreSQL не требуется - приложение подключается к облачной базе данных.

## Установка и запуск

```bash
# Клонируйте репозиторий
git clone https://github.com/Morzh777/productsApp.git
cd productsApp

# Запустите автоматическую установку и запуск
./setup.sh
```

> **Примечание:** Скрипт автоматически установит все зависимости, настроит базу данных, установит и настроит Nginx, и запустит приложение. Для остановки нажмите `Ctrl+C`.

**Основной сайт:** http://localhost  
**API:** http://localhost/api  
**Swagger:** http://localhost/swagger

## Функциональность

- ✅ **Список товаров** с сортировкой по цене и рейтингу
- ✅ **Добавление товаров** с валидацией форм
- ✅ **Редактирование и удаление** товаров
- ✅ **Responsive дизайн** для всех устройств
- ✅ **Swagger документация** API

## Структура проекта

```
productsApp/
├── frontend/next-app/     # Next.js приложение
├── backend/nest-api/      # NestJS API
└── guides/               # Документация
```

## Переменные окружения

> **Примечание:** При использовании `./setup.sh` файлы .env создаются автоматически

### Backend (.env)
```env
# Подключение к облачной базе данных Neon
DATABASE_URL="postgresql://neondb_owner:npg_vGY5fHwSoqZ9@ep-wandering-king-agz11e0s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PORT=3002
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## Основные команды

```bash
# Установка всех зависимостей
npm run install:all

# Запуск backend
cd backend/nest-api && npm run start:dev

# Запуск frontend  
cd frontend/next-app && npm run dev
```

## Особенности

- **Server Actions** с автоматической ревалидацией кеша
- **Встроенное кеширование** через fetch API
- **TypeScript** для полной типизации
- **Prisma ORM** для работы с PostgreSQL
- **Zod валидация** на клиенте и сервере

---

**Автор:** Morzh777