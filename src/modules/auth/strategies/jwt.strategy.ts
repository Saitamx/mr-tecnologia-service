import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.token || request?.headers?.authorization?.replace('Bearer ', '');
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key-change-in-production'),
    });
  }

  async validate(payload: any) {
    // Si es un cliente, retornar información del cliente
    if (payload.type === 'customer') {
      return { sub: payload.sub, email: payload.email, type: 'customer' };
    }
    
    // Si es un usuario admin/manager
    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo. Por favor, inicia sesión nuevamente.');
    }
    return { sub: user.id, username: user.username, role: user.role, type: 'user' };
  }
}
