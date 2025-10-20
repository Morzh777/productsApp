import { Button } from "@/components/ui/button";
import type { FormActionsProps } from "@/types/components/Form.types";

/**
 * Компонент кнопок действий формы
 * 
 * Отображает кнопки "Сохранить" и "Удалить" (если предоставлена функция удаления)
 * с соответствующими состояниями загрузки и блокировкой при выполнении операций.
 * 
 * @param props - Пропсы компонента FormActionsProps
 * @returns JSX элемент с кнопками действий
 */
export function FormActions({
  onDelete,
  isDeleting = false,
  isLoading = false,
  submitLabel = "Сохранить"
}: FormActionsProps) {
  return (
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
  );
}
