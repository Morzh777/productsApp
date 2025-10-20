import type { NumberFieldProps } from "@/types/components/FormField.types";

/**
 * Компонент числового поля ввода
 * 
 * Поддерживает настройку min/max значений, step для десятичных чисел,
 * валидацию с отображением ошибок и автоматическую проверку числового формата.
 * 
 * @param props - Пропсы компонента NumberFieldProps
 * @returns JSX элемент числового поля
 */
export function NumberField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  min,
  max,
  step,
  className = ''
}: NumberFieldProps) {
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
        type="number"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} ${errorClasses}`}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
