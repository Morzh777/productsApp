import type { Product } from "@/shared/schemas/product.schema";

export interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedProduct: Partial<Product>) => Promise<Product>;
  onDelete?: (productId: number) => Promise<void>;
  categories?: string[];
}
