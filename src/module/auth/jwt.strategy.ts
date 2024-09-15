import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // dev only
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key', // Khóa bí mật khi xác thực token
    });
  }

  async validate(payload: any) {
    return { id: payload.userId, username: payload.username };
  }
}