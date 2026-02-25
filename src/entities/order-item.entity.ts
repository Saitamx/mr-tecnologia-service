import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ example: '1', description: 'ID del item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid-order', description: 'ID de la orden' })
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({ example: 'uuid-product', description: 'ID del producto' })
  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { eager: false, nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ example: 'Carcasa iPhone 15 Pro', description: 'Nombre del producto al momento de la compra' })
  @Column({ type: 'varchar', length: 200 })
  productName: string;

  @ApiProperty({ example: 15000, description: 'Precio unitario al momento de la compra' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({ example: 2, description: 'Cantidad' })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ example: 30000, description: 'Subtotal del item' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
