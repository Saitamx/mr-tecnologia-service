import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @ApiProperty({ example: '1', description: 'ID del producto' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Carcasa iPhone 15 Pro', description: 'Nombre del producto' })
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @ApiProperty({
    example: 'Carcasa resistente con protección completa',
    description: 'Descripción del producto',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 15000, description: 'Precio del producto' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: '/images/products/carcasa-iphone.jpg',
    description: 'URL de la imagen del producto',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @ApiProperty({
    example: 'carcasa-iphone-15-pro',
    description: 'Slug del producto para URL',
  })
  @Column({ type: 'varchar', length: 200, unique: true })
  slug: string;

  @ApiProperty({ example: 10, description: 'Stock disponible' })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ example: true, description: 'Si el producto está activo' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ example: true, description: 'Si el producto está destacado' })
  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @ApiProperty({ example: 'uuid-category', description: 'ID de la categoría' })
  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Modelo compatible' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  compatibleModel: string;

  @ApiProperty({ example: 'Negro', description: 'Color del producto' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
