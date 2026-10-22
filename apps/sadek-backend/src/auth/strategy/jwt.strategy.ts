import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

type JwtPayload = { sub: number; iat?: number; exp?: number };

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
    const user = await this.userService.findOne(payload.sub);
    this.assertNotRevoked(payload, user.lastLogoutAt);

    // The token carries only the id; the email comes from the DB.
    return { userId: payload.sub, email: user.email };
  }

  private assertNotRevoked(payload: JwtPayload, lastLogoutAt: Date | null) {
    if (
      lastLogoutAt &&
      payload.iat !== undefined &&
      payload.iat < Math.floor(lastLogoutAt.getTime() / 1000)
    ) {
      throw new UnauthorizedException('Token revoked');
    }
  }
}