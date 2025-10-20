export interface BaseFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface TextFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'url';
}

export interface NumberFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

export interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export interface CategoryFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}
