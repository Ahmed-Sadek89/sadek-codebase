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
      // Tokens carry only `sub` (plus `iat`/`exp`); the profile fields are in `user`.
      // Access and refresh tokens use different secrets, so neither passes for the other.
      const payload = { sub: user.id };
      const refreshOptions: JwtSignOptions = { ...this.refreshJwt };
      return {
        user: {
          sub: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatarUrl ?? null,
        },
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, refreshOptions),
      };
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async me(userId: number) {
    return await this.userService.findOne(userId);
  }

  /** `user` comes from RefreshJwtStrategy. */
  refreshAccess(user: { userId: number }) {
    return {
      access_token: this.jwtService.sign({ sub: user.userId }),
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
    // Revokes every token issued before now: both JWT strategies reject a
    // token whose `iat` is before `lastLogoutAt`.
    await this.userService.logout(user.userId);

    return {
      message: 'Logout successfully',
    };
  }
}