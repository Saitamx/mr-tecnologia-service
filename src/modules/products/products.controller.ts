import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../entities/product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado', type: Product })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filtrar por categoría' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filtrar por estado activo' })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Filtrar productos destacados' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [Product] })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('isActive') isActive?: string,
    @Query('isFeatured') isFeatured?: string,
  ) {
    const filters: any = {};
    if (categoryId) filters.categoryId = categoryId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
    return this.productsService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener productos destacados' })
  @ApiResponse({ status: 200, description: 'Lista de productos destacados', type: [Product] })
  findFeatured() {
    return this.productsService.findAll({ isFeatured: true, isActive: true });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener un producto por slug' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado', type: Product })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
