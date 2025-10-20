"use client";

import { useState } from "react";
import type { Product } from "@/shared/schemas/product.schema";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/StarRating";
import { EditProductModal } from "@/components/ui/modal/EditModal";
import { updateProductAction, deleteProductAction } from "@/services/api/products.actions";
import { useRouter } from "next/navigation";

interface ProductPageClientProps {
  product: Product;
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const router = useRouter();

  const handleSave = async (updatedProduct: Partial<Product>) => {
    try {
      const savedProduct = await updateProductAction(currentProduct.id, updatedProduct);
      setCurrentProduct(savedProduct);
      return savedProduct;
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      throw error;
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      router.push("/products");
      await deleteProductAction(productId);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Главная
              </Link>
              <Image
                src="/icons/chevron-right.png"
                alt=""
                width={12}
                height={12}
                className="text-gray-400"
              />
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Товары
              </Link>
              <Image
                src="/icons/chevron-right.png"
                alt=""
                width={12}
                height={12}
                className="text-gray-400"
              />
              <span className="text-gray-900 font-medium">
                {currentProduct.title}
              </span>
            </div>
          </nav>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Изображение товара */}
              <div className="relative h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                {currentProduct.image ? (
                  <Image
                    src={currentProduct.image}
                    alt={currentProduct.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-lg">Нет изображения</span>
                  </div>
                )}
                
                {/* Тег категории */}
                <div className="absolute bottom-2 left-2">
                  <span className="text-sm text-white bg-black bg-opacity-70 px-2 py-1 rounded-full">
                    {currentProduct.category}
                  </span>
                </div>
              </div>

              {/* Информация о товаре */}
              <div className="space-y-6 flex flex-col justify-between h-full">
                {/* Название */}
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentProduct.title}
                </h1>

                        {/* Рейтинг */}
                        <div className="flex items-center gap-2">
                          <StarRating rating={currentProduct.rating} count={currentProduct.count} />
                        </div>

                {/* Цена */}
                <div className="text-4xl font-bold text-gray-900">
                  ${currentProduct.price}
                </div>

                {/* Описание */}
                {currentProduct.description && (
                  <div>
                    <p className="text-gray-600 leading-relaxed">
                      {currentProduct.description}
                    </p>
                  </div>
                )}

                {/* Разделитель */}
                <div className="w-full h-[1px] bg-[#F0F0F0] mt-auto"></div>

                {/* Кнопки действий */}
                <div className="flex justify-between gap-4 pt-6">
                  <Button href="/" variant="back" className="px-28 sm:px-25">
                    Назад
                  </Button>
                  <Button 
                    onClick={() => setIsEditModalOpen(true)}
                    variant="edit"
                  >
                    Редактировать
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно редактирования */}
      <EditProductModal
        product={currentProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
