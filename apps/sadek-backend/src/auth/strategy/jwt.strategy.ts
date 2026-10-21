import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

type JwtPayload = { sub: number; email: string; avatar?: string, iat?: number; typ?: 'access' | 'refresh' };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.typ === 'refresh') {
      throw new UnauthorizedException('Access token required');
    }

    await this.assertNotRevoked(payload);

    return { userId: payload.sub, email: payload.email, avatar: payload.avatar };
  }

  private async assertNotRevoked(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.sub);
    if (
      user.lastLogoutAt &&
      payload.iat !== undefined &&
      payload.iat < Math.floor(user.lastLogoutAt.getTime() / 1000)
    ) {
      throw new UnauthorizedException('Token revoked');
    }
  }
}