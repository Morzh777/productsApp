/**
 * Типы для компонента ProductPageClient
 */

import type { Product } from "@/shared/schemas/product.schema";

export interface ProductPageClientProps {
  product: Product;
  categories?: string[];
}
