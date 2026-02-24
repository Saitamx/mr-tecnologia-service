import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @ApiProperty({ example: '1', description: 'ID de la categoría' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Carcasas', description: 'Nombre de la categoría' })
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ApiProperty({
    example: 'carcasas',
    description: 'Slug de la categoría para URL',
  })
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @ApiProperty({
    example: 'Carcasas para smartphones',
    description: 'Descripción de la categoría',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: '/images/categories/carcasas.jpg',
    description: 'URL de la imagen de la categoría',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @ApiProperty({ example: 1, description: 'Orden de visualización' })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({ example: true, description: 'Si la categoría está activa' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
