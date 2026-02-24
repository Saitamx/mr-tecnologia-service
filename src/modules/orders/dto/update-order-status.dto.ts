import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, PaymentStatus } from '../../../entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'paid', enum: OrderStatus, description: 'Nuevo estado de la orden' })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ example: 'approved', enum: PaymentStatus, required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
