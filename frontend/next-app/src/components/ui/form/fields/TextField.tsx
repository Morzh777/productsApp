import type { TextFieldProps } from "@/types/components/FormField.types";

/**
 * Компонент текстового поля ввода
 * 
 * Поддерживает типы 'text' и 'url', включает валидацию с отображением ошибок,
 * единообразный стиль и поддержку обязательных полей.
 * 
 * @param props - Пропсы компонента TextFieldProps
 * @returns JSX элемент текстового поля
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  type = 'text',
  className = ''
}: TextFieldProps) {
  const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 placeholder:text-gray-500 placeholder:font-medium text-black text-sm";
  const errorClasses = error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400';
  
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} ${errorClasses}`}
        placeholder={placeholder}
        required={required}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
