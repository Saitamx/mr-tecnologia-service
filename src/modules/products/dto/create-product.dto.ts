import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Carcasa iPhone 15 Pro', description: 'Nombre del producto' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Carcasa resistente con protección completa', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 15000, description: 'Precio del producto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: '/images/products/carcasa-iphone.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'carcasa-iphone-15-pro', description: 'Slug del producto' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 10, description: 'Stock disponible', default: 0 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({ example: true, description: 'Si el producto está activo', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: false, description: 'Si el producto está destacado', default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: 'uuid-category', description: 'ID de la categoría' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'iPhone 15 Pro', required: false })
  @IsOptional()
  @IsString()
  compatibleModel?: string;

  @ApiProperty({ example: 'Negro', required: false })
  @IsOptional()
  @IsString()
  color?: string;
}
