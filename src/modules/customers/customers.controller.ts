import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '../../entities/customer.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerAuthGuard } from './guards/customer-auth.guard';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  register(@Body() registerDto: RegisterCustomerDto) {
    return this.customersService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión como cliente' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginCustomerDto) {
    return this.customersService.login(loginDto);
  }

  @Get('me')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del cliente autenticado' })
  @ApiResponse({ status: 200, description: 'Información del cliente', type: Customer })
  getProfile(@Request() req) {
    return this.customersService.findOne(req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los clientes (solo admin)' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre, email o teléfono' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo' })
  @ApiQuery({ name: 'city', required: false, description: 'Filtrar por ciudad' })
  @ApiQuery({ name: 'region', required: false, description: 'Filtrar por región' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de clientes', type: [Customer] })
  findAll(
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
    @Query('city') city?: string,
    @Query('region') region?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (search) filters.search = search;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (city) filters.city = city;
    if (region) filters.region = region;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    return this.customersService.findAll(filters);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de clientes (solo admin)' })
  @ApiResponse({ status: 200, description: 'Estadísticas de clientes' })
  getStats() {
    return this.customersService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un cliente por ID (solo admin)' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado', type: Customer })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un cliente (solo admin)' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado', type: Customer })
  update(@Param('id') id: string, @Body() updateDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de un cliente (solo admin)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: Customer })
  updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.customersService.updateStatus(id, isActive);
  }
}
