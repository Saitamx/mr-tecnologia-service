import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin@mrtecnologia.com', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'admin', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: 'Admin', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}
