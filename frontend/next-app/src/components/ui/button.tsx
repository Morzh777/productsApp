"use client";

import Link from "next/link";
import type { ButtonProps } from "@/types/components/Button.types";

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
  const baseClasses =
    "font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary:
      "bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white shadow-md hover:shadow-lg focus:ring-gray-500",
    edit: "bg-black hover:bg-gray-800 text-white w-[400px] h-[52px] text-lg font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] shadow-md hover:shadow-lg focus:ring-gray-500",
    back: "bg-[#F0F0F0] hover:bg-gray-300 text-black w-[170px] h-[52px] text-lg font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] focus:ring-gray-500",
    save: "bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] shadow-md hover:shadow-lg focus:ring-gray-500",
    delete: "bg-transparent hover:bg-red-50 text-red-600 border border-red-600 hover:border-red-700 px-6 py-2 text-sm font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] focus:ring-red-500",
    cancel: "bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm font-semibold flex items-center justify-center rounded-l-[26px] rounded-r-[26px] shadow-md hover:shadow-lg focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "py-2 px-4 rounded-md text-sm",
    md: "py-2 px-4 rounded-md",
    lg: "py-3 px-6 rounded-lg text-lg font-semibold",
  };

  const buttonClasses =
    variant === "edit" || variant === "back" || variant === "save" || variant === "delete" || variant === "cancel"
      ? `${variantClasses[variant]} ${className}`
      : `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Если передан editProductId, создаем href для редактирования
  const finalHref = editProductId ? `/products/${editProductId}/edit` : href;

  // Для edit варианта всегда используем button, а не Link
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
