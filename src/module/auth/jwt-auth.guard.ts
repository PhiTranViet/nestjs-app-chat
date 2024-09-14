import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { bool } from 'aws-sdk/clients/signer';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    return new Promise<bool>(async (resolve) => {
      const req = context.switchToHttp().getRequest();
      const headers = req.headers;
      const token = headers.authorization ? headers.authorization : '';
      if (!token) {
        return resolve(false);
      }

      const user = this.jwtService.decode(token.split(' ')[1]);
      if (!user || !user['username']) return resolve(false);

      const userDB = await this.authService.getUserByUsername(user['username']);
      if (!userDB) return resolve(false);

      const p = this.authService.isValidToken(token.split(' ')[1]);

      return resolve(p);
    });
  }
}
