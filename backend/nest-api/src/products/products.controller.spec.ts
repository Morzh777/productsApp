import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProduct = {
    id: 1,
    title: 'Тестовый товар',
    price: 99.99,
    description: 'Тестовое описание',
    image: 'https://example.com/image.jpg',
    category: 'electronics',
    rating: 4.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('должен создать новый товар', async () => {
      const createProductDto = {
        title: 'Тестовый товар',
        price: 99.99,
        description: 'Тестовое описание',
        image: 'https://example.com/image.jpg',
        category: 'electronics',
        rating: 4.5,
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('должен вернуть все товары когда нет фильтра по категории', async () => {
      const mockProducts = [mockProduct];
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(mockProductsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('должен вернуть товары по категории когда указан фильтр', async () => {
      const mockProducts = [mockProduct];
      mockProductsService.findByCategory.mockResolvedValue(mockProducts);

      const result = await controller.findAll('electronics');

      expect(mockProductsService.findByCategory).toHaveBeenCalledWith(
        'electronics',
      );
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('должен вернуть товар по id', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('должен обновить товар', async () => {
      const updateProductDto = {
        title: 'Обновленный товар',
        price: 149.99,
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(1, updateProductDto);

      expect(mockProductsService.update).toHaveBeenCalledWith(
        1,
        updateProductDto,
      );
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('должен удалить товар', async () => {
      mockProductsService.remove.mockResolvedValue(mockProduct);

      const result = await controller.remove(1);

      expect(mockProductsService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });
});
