"use client";

import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/config/routes";
import { NAVIGATION_MESSAGES } from "@/config/ui-messages";
import type { BreadcrumbsProps } from "@/types/components/Breadcrumbs.types";

/**
 * Компонент навигационных хлебных крошек
 * 
 * Отображает иерархическую навигацию для страницы продукта,
 * показывая путь от главной страницы через список товаров к конкретному продукту.
 * 
 * Структура навигации:
 * Главная → Товары → [Название продукта]
 * 
 * @param props - Пропсы компонента BreadcrumbsProps
 * @returns JSX элемент навигационных хлебных крошек
 */
export function Breadcrumbs({ productTitle }: BreadcrumbsProps) {
  return (
    <nav className="mb-8">
      <div className="flex items-center space-x-2 text-sm">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          {NAVIGATION_MESSAGES.HOME}
        </Link>
        <Image
          src="/icons/chevron-right.png"
          alt=""
          width={12}
          height={12}
          className="text-gray-400"
        />
        <Link href={ROUTES.PRODUCTS} className="text-gray-500 hover:text-gray-700">
          {NAVIGATION_MESSAGES.PRODUCTS}
        </Link>
        <Image
          src="/icons/chevron-right.png"
          alt=""
          width={12}
          height={12}
          className="text-gray-400"
        />
        <span className="text-gray-900 font-medium">
          {productTitle}
        </span>
      </div>
    </nav>
  );
}
