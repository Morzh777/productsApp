/**
 * Типы для компонента CreateProductModal
 */

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: string[];
}
