import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { WhatCanDoService } from './what-can-do.service';
import { CreateWhatCanDoDto } from './dto/create-what-can-do.dto';
import { UpdateWhatCanDoDto } from './dto/update-what-can-do.dto';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { FilterWhatCanDoDto } from './dto/filter-what-can-do.dto';

@ApiTags('What Can Do')
@Controller('what-can-do')
export class WhatCanDoController {
  constructor(private readonly whatCanDoService: WhatCanDoService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createWhatCanDoDto: CreateWhatCanDoDto,
    @Request() req: RequestUserDto,
  ) {
    return await this.whatCanDoService.create(createWhatCanDoDto, req.user.userId);
  }

  // Public: the default-view user's rows. Declared before ':id' so "public" is not parsed as an id.
  @Get('public')
  async findAllPublic(@Query() query: FilterWhatCanDoDto) {
    return await this.whatCanDoService.findAllPublic(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterWhatCanDoDto, @Request() req: RequestUserDto) {
    return await this.whatCanDoService.findAll(query, req.user.userId);
  }

  // Declared before ':id' so "me" is not parsed as an id.
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async findMine(@Query() query: FilterWhatCanDoDto, @Request() req: RequestUserDto) {
    return await this.whatCanDoService.findByUser(query, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.whatCanDoService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWhatCanDoDto: UpdateWhatCanDoDto,
    @Request() req: RequestUserDto,
  ) {
    await this.whatCanDoService.update(id, updateWhatCanDoDto, req.user.userId);
    return {
      message: 'What can do updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    await this.whatCanDoService.remove(id, req.user.userId);
    return {
      message: 'What can do deleted successfully',
    };
  }
}
