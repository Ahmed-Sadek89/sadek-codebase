import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { CreateUserInfoDto } from './dto/create-user-info.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('User Info')
@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createUserInfoDto: CreateUserInfoDto,
    @Request() req: RequestUserDto,
  ) {
    const userId = req.user.userId;
    return await this.userInfoService.create(createUserInfoDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.userInfoService.findAll(query);
  }

  // Declared before ':id' so "me" is not parsed as an id.
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async findMine(@Request() req: RequestUserDto) {
    const userId = req.user.userId;
    return await this.userInfoService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userInfoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    await this.userInfoService.update(+id, updateUserInfoDto);
    return {
      message: 'User info updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userInfoService.remove(+id);
    return {
      message: 'User info deleted successfully',
    };
  }
}
