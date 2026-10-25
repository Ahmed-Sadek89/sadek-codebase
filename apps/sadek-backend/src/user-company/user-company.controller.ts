import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { FilterUserCompanyDto } from './dto/filter-user-company.dto';

@ApiTags('User Company')
@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createUserCompanyDto: CreateUserCompanyDto,
    @Request() req: RequestUserDto,
  ) {
    return await this.userCompanyService.create(createUserCompanyDto, req.user.userId);
  }

  // Public: the default-view user's rows. Declared before ':id' so "public" is not parsed as an id.
  @Get('public')
  async findAllPublic(@Query() query: FilterUserCompanyDto) {
    return await this.userCompanyService.findAllPublic(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterUserCompanyDto, @Request() req: RequestUserDto) {
    return await this.userCompanyService.findAll(query, req.user.userId);
  }

  // Declared before ':id' so "me" is not parsed as an id.
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async findMine(@Query() query: FilterUserCompanyDto, @Request() req: RequestUserDto) {
    return await this.userCompanyService.findByUser(query, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.userCompanyService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserCompanyDto: UpdateUserCompanyDto,
    @Request() req: RequestUserDto,
  ) {
    await this.userCompanyService.update(id, updateUserCompanyDto, req.user.userId);
    return {
      message: 'User company updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // Active ⇄ inactive; the response says which way it went.
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    const { isActive } = await this.userCompanyService.toggleActive(id, req.user.userId);
    return {
      message: isActive ? 'User company activated successfully' : 'User company deactivated successfully',
      isActive,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    await this.userCompanyService.remove(id, req.user.userId);
    return {
      message: 'User company deleted successfully',
    };
  }
}
