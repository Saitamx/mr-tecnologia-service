import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Carcasas', description: 'Nombre de la categoría' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'carcasas', description: 'Slug de la categoría' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Carcasas para smartphones', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '/images/categories/carcasas.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 1, description: 'Orden de visualización', default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ example: true, description: 'Si la categoría está activa', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
