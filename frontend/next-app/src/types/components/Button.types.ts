export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "edit" | "add" | "back" | "save" | "delete" | "cancel";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  editProductId?: string;
}
