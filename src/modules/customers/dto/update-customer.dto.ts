import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullName?: string;

  @ApiProperty({ example: 'juan@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+56912345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'Calle Falsa 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Santiago', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Región Metropolitana', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
