import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @ApiProperty({ example: '1', description: 'ID del usuario' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @ApiProperty({ example: 'admin@mrtecnologia.com', description: 'Email del usuario' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    example: 'admin',
    description: 'Rol del usuario',
    enum: UserRole,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MANAGER,
  })
  role: UserRole;

  @ApiProperty({ example: 'Admin', description: 'Nombre completo' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
