"use client";

import type { ProductFormProps } from "@/types/components/ProductForm.types";
import { useProductForm } from "@/hooks/useProductForm";
import {
  validateProductForm,
  validateImageField,
  prepareProductPayload,
} from "@/lib/form-validation";
import { TextField } from "@/components/ui/form/fields/TextField";
import { NumberField } from "@/components/ui/form/fields/NumberField";
import { TextAreaField } from "@/components/ui/form/fields/TextAreaField";
import { CategoryField } from "@/components/ui/form/fields/CategoryField";
import { FormActions } from "@/components/ui/form/FormActions";

/**
 * Основной компонент формы продукта
 * 
 * Декомпозированная форма для создания и редактирования продуктов,
 * использующая переиспользуемые компоненты полей и централизованную логику валидации.
 * 
 * @param props - Пропсы компонента ProductFormProps
 * @returns JSX элемент формы продукта
 */
export function ProductForm({
  product,
  onSubmit,
  onDelete,
  isLoading,
  isDeleting,
  categories = [],
  submitLabel = "Сохранить",
}: ProductFormProps) {
  const { formData, errors, updateField, setFieldError, setAllErrors } =
    useProductForm(product);

  /**
   * Обработчик отправки формы
   * 
   * Выполняет валидацию данных формы и отправляет их через callback onSubmit
   * если валидация прошла успешно.
   * 
   * @param e - Событие отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setAllErrors(validation.errors);
      return;
    }

    const payload = prepareProductPayload(formData, product);
    await onSubmit(payload);
  };

  /**
   * Обработчик изменения поля изображения
   * 
   * Обновляет значение поля и выполняет валидацию URL изображения
   * с отображением ошибки в реальном времени.
   * 
   * @param value - Новое значение URL изображения
   */
  const handleImageChange = (value: string) => {
    updateField("image", value);
    const error = validateImageField(value);
    setFieldError("image", error);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-5 space-y-3 flex-1 overflow-y-auto"
    >
      {/* Название товара */}
      <TextField
        id="title"
        label="Название товара"
        value={formData.title}
        onChange={(value) => updateField("title", value)}
        placeholder={product?.title || "Введите название товара"}
        error={errors.title}
        required
      />

      {/* Цена */}
      <NumberField
        id="price"
        label="Цена ($)"
        value={formData.price}
        onChange={(value) => updateField("price", value)}
        placeholder={product?.price ? product.price.toString() : "0.00"}
        error={errors.price}
        min={0}
        step={0.01}
        required
      />

      {/* Описание */}
      <TextAreaField
        id="description"
        label="Описание"
        value={formData.description}
        onChange={(value) => updateField("description", value)}
        placeholder={product?.description || "Введите описание товара"}
        rows={3}
      />

      {/* Категория + Рейтинг + Количество отзывов в одной строке */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <CategoryField
          id="category"
          label="Категория"
          value={formData.category}
          onChange={(value) => updateField("category", value)}
          categories={categories}
          error={errors.category}
        />

        <NumberField
          id="rating"
          label="Рейтинг (0-5)"
          value={formData.rating}
          onChange={(value) => updateField("rating", value)}
          placeholder={product?.rating ? product.rating.toString() : "4.5"}
          min={0}
          max={5}
          step={0.1}
          className="h-[40px]"
        />

        <NumberField
          id="count"
          label="Количество отзывов"
          value={formData.count}
          onChange={(value) => updateField("count", value)}
          placeholder={product?.count ? product.count.toString() : "120"}
          min={0}
          className="h-[40px]"
        />
      </div>

      {/* Изображение */}
      <TextField
        id="image"
        label="URL изображения"
        value={formData.image}
        onChange={handleImageChange}
        placeholder={product?.image || "https://example.com/image.jpg"}
        error={errors.image}
        type="url"
      />

      {/* Кнопки */}
      <FormActions
        onDelete={onDelete}
        isDeleting={isDeleting}
        isLoading={isLoading}
        submitLabel={submitLabel}
      />
    </form>
  );
}
