/**
 * Типы для компонента ProductImage
 */

export interface ProductImageProps {
  product: {
    image?: string | null;
    title: string;
  };
  className?: string;
  sizes?: string;
  children?: React.ReactNode;
}
