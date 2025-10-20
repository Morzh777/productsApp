import type { TextAreaFieldProps } from "@/types/components/FormField.types";

/**
 * Компонент многострочного текстового поля
 * 
 * Предназначен для ввода длинного текста с настраиваемым количеством строк,
 * единообразным стилем и автоматическим изменением размера.
 * 
 * @param props - Пропсы компонента TextAreaFieldProps
 * @returns JSX элемент многострочного поля
 */
export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = ''
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder:text-gray-500 placeholder:font-medium text-black text-sm"
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}
