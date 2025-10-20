"use client";

import Link from "next/link";
import type { ButtonProps } from "@/types/components/Button.types";

/**
 * Универсальный компонент кнопки
 * 
 * Предоставляет гибкий интерфейс для создания кнопок с различными вариантами
 * стилизации, размерами и функциональностью. Поддерживает как обычные кнопки,
 * так и кнопки-ссылки с использованием Next.js Link.
 * 
 * @param props - Пропсы компонента ButtonProps
 * @returns JSX элемент кнопки или ссылки
 */
export function Button({
  children,
  href,
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  editProductId,
  type = "button",
  disabled = false,
}: ButtonProps) {
  /**
   * Базовые CSS классы для всех кнопок
   */
  const baseClasses =
    "font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  /**
   * Стили для различных вариантов кнопок
   */
  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary:
      "bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white shadow-md hover:shadow-lg focus:ring-gray-500",
    edit: "bg-black hover:bg-gray-800 text-white w-[400px] h-[52px] text-lg font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] shadow-md hover:shadow-lg focus:ring-gray-500",
    add: "bg-black hover:bg-gray-800 text-white w-[44px] h-[44px] text-xl font-bold flex items-center justify-center rounded-full shadow-md hover:shadow-lg focus:ring-gray-500",
    back: "bg-[#F0F0F0] hover:bg-gray-300 text-black w-[170px] h-[52px] text-lg font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] focus:ring-gray-500",
    save: "bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] shadow-md hover:shadow-lg focus:ring-gray-500",
    delete: "bg-transparent hover:bg-red-50 text-red-600 border border-red-600 hover:border-red-700 px-6 py-2 text-sm font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] focus:ring-red-500",
    cancel: "bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] shadow-md hover:shadow-lg focus:ring-gray-500",
  };

  /**
   * Стили для различных размеров кнопок
   * Определяет отступы и размеры текста
   */
  const sizeClasses = {
    sm: "py-2 px-4 rounded-md text-sm",
    md: "py-2 px-4 rounded-md",
    lg: "py-3 px-6 rounded-lg text-lg font-semibold",
  };

  /**
   * Формирование финальных CSS классов для кнопки
   * Кастомные варианты используют только variantClasses, остальные комбинируют все стили
   */
  const buttonClasses =
    variant === "edit" || variant === "add" || variant === "back" || variant === "save" || variant === "delete" || variant === "cancel"
      ? `${variantClasses[variant]} ${className}`
      : `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  /**
   * Определение финальной ссылки
   * Если передан editProductId, автоматически формирует ссылку для редактирования
   */
  const finalHref = editProductId ? `/products/${editProductId}/edit` : href;

  /**
   * Условная логика рендеринга:
   * 1. Для edit варианта с onClick - всегда button
   * 2. При наличии href - Link компонент
   * 3. Иначе - обычная button
   */
  if (variant === "edit" && onClick) {
    return (
      <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  }

  if (finalHref) {
    return (
      <Link href={finalHref} className={buttonClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
