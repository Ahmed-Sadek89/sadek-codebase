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
      const payload = { sub: user.id, email: user.email, avatar: user.avatarUrl };
      const refreshPayload = { ...payload, typ: 'refresh' };
      const refreshOptions: JwtSignOptions = { ...this.refreshJwt };

      return {
        // The avatar is only returned here, not signed into the tokens, so
        // the JWTs stay small; the client keeps it in its own session.
        user: { ...payload, avatar: user.avatarUrl ?? null },
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(refreshPayload, refreshOptions),
      };
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  /** The current user's profile; `password` is never selected. */
  async me(userId: number) {
    return await this.userService.findOne(userId);
  }

  refreshAccess(user: { userId: number; email: string }) {
    return {
      access_token: this.jwtService.sign({ sub: user.userId, email: user.email }),
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