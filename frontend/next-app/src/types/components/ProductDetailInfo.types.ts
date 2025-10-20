/**
 * Типы для компонента ProductDetailInfo
 */

import type { Product } from "@/shared/schemas/product.schema";

export interface ProductDetailInfoProps {
  product: Product;
  onEdit: () => void;
}
