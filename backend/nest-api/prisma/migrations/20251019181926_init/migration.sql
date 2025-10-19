-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "category" VARCHAR(100) NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
