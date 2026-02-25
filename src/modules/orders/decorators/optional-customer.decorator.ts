import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const OptionalCustomer = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const configService = new ConfigService();
      const jwtService = new JwtService({ secret: configService.get('JWT_SECRET') });
      const payload = jwtService.verify(token);
      
      if (payload.type === 'customer') {
        return { id: payload.sub, email: payload.email };
      }
    } catch (error) {
      // Token inválido o expirado, retornar null
    }
    
    return null;
  },
);
