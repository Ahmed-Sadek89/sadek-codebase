import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from "bcrypt";
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) private readonly refreshJwt: ConfigType<typeof refreshJwtConfig>
  ) { }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.login(loginDto)
      // The avatar rides in the access token so clients can show it without
      // another request; the refresh token needs only the identity.
      const payload = { sub: user.id, email: user.email, avatar: user.avatarUrl ?? null };
      const refreshPayload = { sub: user.id, email: user.email, typ: 'refresh' };
      const refreshOptions: JwtSignOptions = { ...this.refreshJwt };

      return {
        user: payload,
        access_token: this.jwtService.sign({ ...payload, avatar: user.avatarUrl ?? null }),
        refresh_token: this.jwtService.sign(refreshPayload, refreshOptions),
      };
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async me(userId: number) {
    return await this.userService.findOne(userId);
  }

  /** `user` comes from RefreshJwtStrategy, which reads the current avatar from the DB. */
  refreshAccess(user: { userId: number; email: string; avatar: string | null }) {
    return {
      access_token: this.jwtService.sign({ sub: user.userId, email: user.email, avatar: user.avatar }),
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.userService.login({
      email: changePasswordDto.email,
      password: changePasswordDto.password,
    });

    if (changePasswordDto.newPassword === changePasswordDto.password) {
      throw new BadRequestException("New password must be different from current password");
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userService.updatePassword(user.id, hashedPassword);

    return { message: "Password changed successfully" };
  }

  async logout(user: { userId: number; email: string }) {
    await this.userService.logout(user.userId);

    const payload = { sub: user.userId, email: user.email };
    const refreshPayload = { ...payload, typ: 'refresh' };
    const expiredIn = '1s';

    const accessOptions: JwtSignOptions = { expiresIn: expiredIn };
    const refreshOptions: JwtSignOptions = { ...this.refreshJwt, expiresIn: expiredIn };

    this.jwtService.sign(payload, accessOptions);
    this.jwtService.sign(refreshPayload, refreshOptions);

    return {
      message: 'Logout successfully',
    };
  }
}