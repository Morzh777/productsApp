import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создает новый товар
   */
  async create(createProductDto: CreateProductDto) {
    return this.prisma.safeQuery(async () => {
      return this.prisma.product.create({
        data: createProductDto,
      });
    });
  }

  /**
   * Получает все товары
   */
  async findAll() {
    return this.prisma.safeQuery(async () => {
      return this.prisma.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  }

  /**
   * Получает товар по ID
   */
  async findOne(id: number) {
    return this.prisma.safeQuery(async () => {
      return this.prisma.product.findUnique({
        where: { id },
      });
    });
  }

  /**
   * Обновляет товар по ID
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.safeQuery(async () => {
      return this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    });
  }

  /**
   * Удаляет товар по ID
   */
  async remove(id: number) {
    return this.prisma.safeQuery(async () => {
      await this.prisma.product.delete({
        where: { id },
      });
      return { success: true };
    });
  }

  /**
   * Получает товары по категории
   */
  async findByCategory(category: string) {
    return this.prisma.safeQuery(async () => {
      return this.prisma.product.findMany({
        where: { category },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  }

  /**
   * Получает список всех категорий
   */
  async getCategories() {
    return this.prisma.safeQuery(async () => {
      const rows = await this.prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });
      return rows.map((r) => r.category).filter((c): c is string => !!c);
    });
  }
}
