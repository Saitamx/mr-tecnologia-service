import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, IsEnum, IsNumber, Min, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../../entities/order.entity';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'uuid-product', description: 'ID del producto' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, description: 'Cantidad' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del cliente' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+56912345678', description: 'Teléfono del cliente' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección de entrega', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: 'Items de la orden' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ example: 'webpay', enum: PaymentMethod, required: false })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: 0, description: 'Descuento aplicado', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({ example: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
