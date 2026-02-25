import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('stats')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtener estadísticas del dashboard' })
  @ApiResponse({ status: 200, description: 'Estadísticas del dashboard' })
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  @Get('sales-by-period')
  @ApiOperation({ summary: 'Obtener ventas por período' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Número de días (default: 30)' })
  @ApiResponse({ status: 200, description: 'Ventas por período' })
  getSalesByPeriod(@Query('days') days?: string) {
    return this.statsService.getSalesByPeriod(days ? parseInt(days) : 30);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Obtener productos más vendidos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de productos (default: 10)' })
  @ApiResponse({ status: 200, description: 'Productos más vendidos' })
  getTopProducts(@Query('limit') limit?: string) {
    return this.statsService.getTopProducts(limit ? parseInt(limit) : 10);
  }

  @Get('orders-by-month')
  @ApiOperation({ summary: 'Obtener órdenes por mes' })
  @ApiQuery({ name: 'months', required: false, type: Number, description: 'Número de meses (default: 6)' })
  @ApiResponse({ status: 200, description: 'Órdenes por mes' })
  getOrdersByMonth(@Query('months') months?: string) {
    return this.statsService.getOrdersByMonth(months ? parseInt(months) : 6);
  }

  @Get('customers-by-month')
  @ApiOperation({ summary: 'Obtener clientes por mes' })
  @ApiQuery({ name: 'months', required: false, type: Number, description: 'Número de meses (default: 6)' })
  @ApiResponse({ status: 200, description: 'Clientes por mes' })
  getCustomersByMonth(@Query('months') months?: string) {
    return this.statsService.getCustomersByMonth(months ? parseInt(months) : 6);
  }
}
