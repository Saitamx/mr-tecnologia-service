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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from '../../entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus, PaymentStatus } from '../../entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden (autenticación opcional)' })
  @ApiResponse({ status: 201, description: 'Orden creada', type: Order })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req?: any) {
    // Si hay un token de cliente, asociar la orden con el cliente
    const authHeader = req?.headers?.authorization;
    let customerId: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const payload = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });
        if (payload.type === 'customer') {
          customerId = payload.sub;
        }
      } catch (error) {
        // Si el token es inválido, continuar sin autenticación
      }
    }
    
    return this.ordersService.create(createOrderDto, customerId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus, description: 'Filtrar por estado de pago' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filtrar por ID de cliente' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes', type: [Order] })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('customerId') customerId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (customerId) filters.customerId = customerId;
    return this.ordersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada', type: Order })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Obtener una orden por número de orden' })
  @ApiResponse({ status: 200, description: 'Orden encontrada', type: Order })
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Post(':id/webpay/init')
  @ApiOperation({ summary: 'Iniciar pago con Webpay' })
  @ApiResponse({ status: 200, description: 'Token y URL de Webpay' })
  initiateWebpay(@Param('id') id: string) {
    return this.ordersService.initiateWebpayPayment(id);
  }

  @Post('webpay/confirm')
  @ApiOperation({ summary: 'Confirmar pago de Webpay' })
  @ApiResponse({ status: 200, description: 'Orden actualizada', type: Order })
  confirmWebpay(@Body('token') token: string) {
    return this.ordersService.confirmWebpayPayment(token);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de una orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada', type: Order })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }
}
