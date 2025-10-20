import type { Product } from "@/shared/schemas/product.schema";

export type SortBy = "newest" | "title" | "price-asc" | "price-desc" | "rating";

export function sortProductsBy(products: Product[], sortBy: SortBy): Product[] {
  const productsCopy = [...products];
  productsCopy.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id - a.id;
      case "title":
        return a.title.localeCompare(b.title);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  return productsCopy;
}


