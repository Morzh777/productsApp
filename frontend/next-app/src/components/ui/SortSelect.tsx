"use client";

import Image from "next/image";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { SORT_MESSAGES } from "@/config/ui-messages";
import type { SortSelectProps, SortOption } from "@/types/components/SortSelect.types";

export { type SortOption };

/**
 * Компонент выбора сортировки
 * 
 * Предоставляет интерфейс для выбора критерия сортировки товаров
 * с использованием Headless UI Listbox для доступности и правильного поведения.
 * Отображает текущий выбранный вариант и выпадающий список опций.
 */
export function SortSelect({ value, onChange, options, label = SORT_MESSAGES.SORT_BY }: SortSelectProps) {
  /**
   * Определение текущего лейбла для отображения
   */
  const currentLabel = options.find(o => o.value === value)?.label ?? options[0]?.label ?? "";

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="inline-flex items-center gap-1 bg-transparent text-sm text-gray-900 font-medium px-0 py-0 rounded-none focus:outline-none ring-0 border-0">
            {currentLabel}
            <Image src="/icons/dropDown.png" alt="" width={12} height={12} style={{ width: "auto", height: "auto" }} />
          </ListboxButton>
          <ListboxOptions anchor="bottom start" className="absolute z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-md ring-1 ring-black/5 focus:outline-none py-1">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ active, selected }) => `cursor-pointer select-none px-3 py-2 text-sm ${active ? 'bg-gray-50' : 'bg-white'} ${selected ? 'font-medium text-gray-900' : 'text-gray-700'}`}
              >
                {option.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}