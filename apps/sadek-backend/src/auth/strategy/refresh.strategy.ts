import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import refreshJwtConfig from '../config/refresh-jwt.config';

type JwtPayload = { sub: number; email: string; iat?: number; typ?: 'access' | 'refresh' };

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    refreshJwt: ConfigType<typeof refreshJwtConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      ignoreExpiration: false,
      secretOrKey: refreshJwt.secret as string,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.typ !== 'refresh') {
      throw new UnauthorizedException('Refresh token required');
    }

    const user = await this.userService.findOne(payload.sub);
    if (
      user.lastLogoutAt &&
      payload.iat !== undefined &&
      payload.iat < Math.floor(user.lastLogoutAt.getTime() / 1000)
    ) {
      throw new UnauthorizedException('Token revoked');
    }

    return { userId: payload.sub, email: payload.email };
  }
}