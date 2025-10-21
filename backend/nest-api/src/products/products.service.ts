import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.prisma.product.delete({
      where: { id },
    });
    return { success: true };
  }

  async findByCategory(category: string) {
    return this.prisma.product.findMany({
      where: { category },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

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
