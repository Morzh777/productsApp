"use client";

import { useState, useEffect, useRef } from "react";
import type { ProductFormProps } from "@/types/components/ProductForm.types";
import type { Product } from "@/shared/schemas/product.schema";
import { Button } from "@/components/ui/button";
import { ProductFormSchema, ImageFieldSchema } from "@/shared/schemas/product.schema";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import Image from "next/image";

export function ProductForm({ 
  product,
  onSubmit,
  onDelete, 
  isLoading,
  isDeleting,
  categories = [],
  submitLabel = "Сохранить"
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    rating: "",
    count: "",
    image: "",
  });
  const [categoryQuery, setCategoryQuery] = useState("");
  const categoryButtonRef = useRef<HTMLButtonElement | null>(null);

  const isValidImageSrc = (src?: string | null) => {
    if (!src) return false;
    return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const setFieldError = (name: string, message?: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name] = message; else delete next[name];
      return next;
    });
  };

  // Обновляем форму при изменении продукта
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price ? product.price.toString() : "",
        description: product.description || "",
        category: product.category || "",
        rating: product.rating ? product.rating.toString() : "",
        count: product.count ? product.count.toString() : "",
        image: product.image || "",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Клиентская валидация ProductFormSchema
    const toValidate = {
      title: formData.title,
      price: formData.price,
      description: formData.description,
      image: formData.image,
      category: formData.category,
      rating: formData.rating,
    };
    
    const validateResult = ProductFormSchema.safeParse(toValidate);
    if (!validateResult.success) {
      const flat = validateResult.error.flatten();
      const fieldErrors: Record<string, string> = {};
      Object.entries(flat.fieldErrors).forEach(([key, msgs]) => {
        if (msgs && msgs[0]) fieldErrors[key] = msgs[0];
      });
      setErrors(fieldErrors);
      return;
    } else {
      setErrors({});
    }

    const payload: Partial<Product> = {
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      image: isValidImageSrc(formData.image) ? formData.image : "",
    };
    if (formData.rating) payload.rating = Number(formData.rating);
    if (formData.count) payload.count = Number(formData.count);
    if (product?.id) payload.id = product.id;

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-5 space-y-3 flex-1 overflow-y-auto"
    >
      {/* Название товара */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Название товара
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setFieldError('title'); }}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 placeholder:text-gray-500 placeholder:font-medium text-black text-sm ${errors.title ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'}`}
          placeholder={product?.title || "Введите название товара"}
          required
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      {/* Цена */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Цена ($)
        </label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => { setFormData({ ...formData, price: e.target.value }); setFieldError('price'); }}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 placeholder:text-gray-500 placeholder:font-medium text-black text-sm ${errors.price ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'}`}
          placeholder={product?.price ? product.price.toString() : "0.00"}
          min="0"
          step="0.01"
          required
        />
        {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
      </div>

      {/* Описание */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Описание
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder:text-gray-500 placeholder:font-medium text-black text-sm"
          placeholder={product?.description || "Введите описание товара"}
          rows={3}
        />
      </div>

      {/* Категория + Рейтинг + Количество отзывов в одной строке */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <Combobox
            value={formData.category}
            onChange={(v: string | null) => {
              const newCategory = v ?? "";
              setFormData({ ...formData, category: newCategory });
              setCategoryQuery(newCategory);
              setFieldError('category');
            }}
          >
            <div className="relative">
                <ComboboxInput
                  className="w-full pl-3 pr-10 py-2 h-[40px] rounded-md border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder:text-gray-400"
                placeholder="Выберите или введите"
                  displayValue={(v: string | null) => v ?? ""}
                  onChange={(e) => { 
                    const value = e.target.value;
                    setCategoryQuery(value);
                    setFormData({ ...formData, category: value });
                    setFieldError('category');
                  }}
                  onFocus={() => categoryButtonRef.current?.click()}
              />
                <ComboboxButton aria-label="Открыть список категорий" className="absolute inset-y-0 right-0 w-10 px-3 flex items-center justify-center" ref={categoryButtonRef}>
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
        </div>
        {/* Рейтинг */}
        <div>
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Рейтинг (0-5)
        </label>
          <input
          type="number"
          id="rating"
          value={formData.rating}
            onChange={(e) => { setFormData({ ...formData, rating: e.target.value }); setFieldError('rating'); }}
            className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder:text-gray-500 placeholder:font-medium text-black text-sm"
          placeholder={product?.rating ? product.rating.toString() : "4.5"}
          min="0"
          max="5"
          step="0.1"
        />
        </div>

        {/* Количество отзывов */}
        <div>
        <label
          htmlFor="count"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Количество отзывов
        </label>
          <input
          type="number"
          id="count"
          value={formData.count}
          onChange={(e) => setFormData({ ...formData, count: e.target.value })}
            className="w-full px-3 py-2 h-[40px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder:text-gray-500 placeholder:font-medium text-black text-sm"
          placeholder={product?.count ? product.count.toString() : "120"}
          min="0"
        />
        </div>
      </div>

      {/* Изображение */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          URL изображения
        </label>
        <input
          type="url"
          id="image"
          value={formData.image}
          onChange={(e) => {
            const v = e.target.value;
            setFormData({ ...formData, image: v });
            const r = ImageFieldSchema.safeParse(v);
            setFieldError(
              'image',
              r.success ? undefined : (r.error.issues?.[0]?.message ?? 'Некорректное значение')
            );
          }}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 placeholder:text-gray-500 placeholder:font-medium text-black text-sm ${errors.image ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'}`}
          placeholder={product?.image || "https://example.com/image.jpg"}
        />
        {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
      </div>

      {/* Кнопки */}
      <div className="flex gap-2 pt-3 border-t border-gray-200 bg-white flex-shrink-0">
        {onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            variant="delete"
            className="flex-1"
            disabled={isDeleting}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </Button>
        )}
        <Button
          type="submit"
          variant="save"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Добавление..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
