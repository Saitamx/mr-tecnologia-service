import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginCustomerDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña' })
  @IsString()
  password: string;
}
