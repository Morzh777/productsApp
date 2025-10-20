/**
 * Типы для компонента SortSelect
 */

export interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  label?: string;
}

export interface SortOption {
  value: string;
  label: string;
}
