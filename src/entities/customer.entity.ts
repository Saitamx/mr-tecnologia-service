import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity('customers')
export class Customer {
  @ApiProperty({ example: '1', description: 'ID del cliente' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del cliente' })
  @Column({ type: 'varchar', length: 200 })
  fullName: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email del cliente' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ example: '+56912345678', description: 'Teléfono del cliente' })
  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @ApiProperty({ example: 'hashed_password', description: 'Contraseña hasheada' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección del cliente', required: false })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ example: 'Santiago', description: 'Ciudad del cliente', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @ApiProperty({ example: 'Región Metropolitana', description: 'Región del cliente', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string;

  @ApiProperty({ example: true, description: 'Si el cliente está activo' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-01', description: 'Fecha de último acceso', required: false })
  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
