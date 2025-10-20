import { getProduct } from "@/lib/api";
import type { Product } from "@/shared/schemas/product.schema";
import { ProductPageClient } from "@/components/ProductPageClient";
import { notFound } from "next/navigation";

// Revalidate every minute
export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product: Product | null = null;
  let error: string | null = null;

  try {
    product = await getProduct(Number(id));
  } catch (err: any) {
    console.error("Ошибка при загрузке товара:", err);
    error = err.message;
  }

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}