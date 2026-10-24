import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { FilterPageDto } from './dto/filter-page.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createPageDto: CreatePageDto, @Request() req: RequestUserDto) {
    return await this.pagesService.create(createPageDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterPageDto, @Request() req: RequestUserDto) {
    return await this.pagesService.findAll(query, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.pagesService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePageDto: UpdatePageDto,
    @Request() req: RequestUserDto,
  ) {
    await this.pagesService.update(id, updatePageDto, req.user.userId);
    return {
      message: 'Page updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    await this.pagesService.remove(id, req.user.userId);
    return {
      message: 'Page deleted successfully',
    };
  }
}
