import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guard/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guard/refresh-auth/refresh-auth.guard';
import { RequestUserDto } from './dto/request-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.refreshAccess(req.user);
  }

  /** The signed-in user, by the `sub` (user id) of the access token. */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me")
  async me(@Request() req: RequestUserDto) {
    return await this.authService.me(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("change-password")
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(changePasswordDto);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("logout")
  async logout(@Request() req: RequestUserDto) {
    return await this.authService.logout(req.user);
  }
}
