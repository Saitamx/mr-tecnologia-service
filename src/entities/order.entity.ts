import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from './order-item.entity';
import { Customer } from './customer.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  WEBPAY = 'webpay',
  TRANSFER = 'transfer',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @ApiProperty({ example: '1', description: 'ID de la orden' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'ORD-2024-001', description: 'Número de orden' })
  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @ApiProperty({ example: 'uuid-customer', description: 'ID del cliente (opcional si es usuario registrado)', required: false })
  @Column({ type: 'uuid', nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, { nullable: true, eager: false })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  @Column({ type: 'varchar', length: 200 })
  customerName: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del cliente' })
  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @ApiProperty({ example: '+56912345678', description: 'Teléfono del cliente' })
  @Column({ type: 'varchar', length: 50 })
  customerPhone: string;

  @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección de entrega' })
  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  @ApiProperty({ example: 50000, description: 'Subtotal de la orden' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({ example: 0, description: 'Descuento aplicado' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @ApiProperty({ example: 50000, description: 'Total de la orden' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    example: 'pending',
    description: 'Estado de la orden',
    enum: OrderStatus,
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    example: 'webpay',
    description: 'Método de pago',
    enum: PaymentMethod,
  })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.WEBPAY,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    example: 'pending',
    description: 'Estado del pago',
    enum: PaymentStatus,
  })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({ example: 'token123', description: 'Token de Webpay', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  webpayToken: string;

  @ApiProperty({ example: '123456789', description: 'ID de transacción Webpay', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  webpayTransactionId: string;

  @ApiProperty({ example: 'Notas adicionales', required: false })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true, eager: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
