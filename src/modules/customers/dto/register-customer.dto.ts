import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class RegisterCustomerDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  fullName: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+56912345678', description: 'Teléfono' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Santiago', description: 'Ciudad', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Región Metropolitana', description: 'Región', required: false })
  @IsOptional()
  @IsString()
  region?: string;
}
