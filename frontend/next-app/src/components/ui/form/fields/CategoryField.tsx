"use client";

import { useState, useRef } from "react";
import type { CategoryFieldProps } from "@/types/components/FormField.types";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import Image from "next/image";

/**
 * Компонент поля выбора категории с автодополнением
 * 
 * Интегрирован с Headless UI Combobox для создания интерактивного поля
 * с автодополнением, фильтрацией и возможностью добавления новых категорий.
 * 
 * @param props - Пропсы компонента CategoryFieldProps
 * @returns JSX элемент поля выбора категории
 */
export function CategoryField({
  id,
  label,
  value,
  onChange,
  categories,
  error,
  className = ''
}: CategoryFieldProps) {
  const [categoryQuery, setCategoryQuery] = useState(value);
  const categoryButtonRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Обработчик изменения выбранной категории
   * @param newValue - Новое значение категории или null
   */
  const handleCategoryChange = (newValue: string | null) => {
    const category = newValue ?? "";
    onChange(category);
    setCategoryQuery(category);
  };

  /**
   * Обработчик изменения текста в поле ввода
   * @param inputValue - Введенное значение
   */
  const handleInputChange = (inputValue: string) => {
    setCategoryQuery(inputValue);
    onChange(inputValue);
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Combobox
        value={value}
        onChange={handleCategoryChange}
      >
        <div className="relative">
          <ComboboxInput
            className="w-full pl-3 pr-10 py-2 h-[40px] rounded-md border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder:text-gray-400"
            placeholder="Выберите или введите"
            displayValue={(v: string | null) => v ?? ""}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => categoryButtonRef.current?.click()}
          />
          <ComboboxButton 
            aria-label="Открыть список категорий" 
            className="absolute inset-y-0 right-0 w-10 px-3 flex items-center justify-center" 
            ref={categoryButtonRef}
          >
            <Image
              src="/icons/dropDown.png"
              alt=""
              width={12}
              height={12}
            />
          </ComboboxButton>
          <ComboboxOptions className="absolute z-10 mt-2 left-0 w-full max-h-60 overflow-auto origin-top-left rounded-md bg-white shadow-md ring-1 ring-black/5 focus:outline-none py-1">
            {(["__new__", ...categories] as string[])
              .filter((c) =>
                c === "__new__"
                  ? true
                  : c.toLowerCase().includes(categoryQuery.toLowerCase())
              )
              .map((c) =>
                c === "__new__" ? (
                  categoryQuery &&
                  !categories
                    .map((s) => s.toLowerCase())
                    .includes(categoryQuery.toLowerCase()) ? (
                    <ComboboxOption
                      key="__new__"
                      value={categoryQuery}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none px-3 py-2 text-sm ${
                          active ? "bg-gray-50" : "bg-white"
                        } ${
                          selected
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`
                      }
                    >
                      Добавить новую: {categoryQuery}
                    </ComboboxOption>
                  ) : null
                ) : (
                  <ComboboxOption
                    key={c}
                    value={c}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none px-3 py-2 text-sm ${
                        active ? "bg-gray-50" : "bg-white"
                      } ${
                        selected
                          ? "font-medium text-gray-900"
                          : "text-gray-700"
                      }`
                    }
                  >
                    {c}
                  </ComboboxOption>
                )
              )}
          </ComboboxOptions>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
