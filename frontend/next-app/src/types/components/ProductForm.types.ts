import type { Product } from "@/shared/schemas/product.schema";

export interface ProductFormProps {
  product: Product | null;
  onSubmit: (formData: Partial<Product>) => Promise<Product>;
  onDelete?: () => void;
  isLoading: boolean;
  isDeleting: boolean;
  categories?: string[];
  submitLabel?: string;
}
