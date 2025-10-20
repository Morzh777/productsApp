/**
 * Типы для компонента ProductsPageClient
 */

import type { Product } from "@/shared/schemas/product.schema";

export interface ProductsPageClientProps {
  products: Product[];
  categories?: string[];
}
