import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(filters?: { categoryId?: string; isActive?: boolean; isFeatured?: boolean }): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filters?.categoryId) {
      query.where('product.categoryId = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('product.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.isFeatured !== undefined) {
      query.andWhere('product.isFeatured = :isFeatured', { isFeatured: filters.isFeatured });
    }

    return await query.orderBy('product.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con slug ${slug} no encontrado`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
