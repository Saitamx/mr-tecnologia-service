import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../../entities/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada', type: Category })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías', type: [Category] })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('with-products')
  @ApiOperation({ summary: 'Obtener todas las categorías con sus productos' })
  @ApiResponse({ status: 200, description: 'Lista de categorías con productos', type: [Category] })
  findAllWithProducts() {
    return this.categoriesService.findAllWithProducts();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener una categoría por slug' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada', type: Category })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
