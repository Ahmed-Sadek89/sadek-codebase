import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SeoService } from './seo.service';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { FilterSeoDto } from './dto/filter-seo.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { SeoPageName } from '@repo/constants/seo-pages';

@ApiTags('Seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createSeoDto: CreateSeoDto, @Request() req: RequestUserDto) {
    return await this.seoService.create(createSeoDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterSeoDto, @Request() req: RequestUserDto) {
    return await this.seoService.findAll(query, req.user.userId);
  }

  // Public: the website's SEO for one page. Declared before ':id' so "public" is not parsed as an id.
  @Get('public/:pageName')
  async findPublic(@Param('pageName', new ParseEnumPipe(SeoPageName)) pageName: SeoPageName) {
    return await this.seoService.findPublic(pageName);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.seoService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeoDto: UpdateSeoDto,
    @Request() req: RequestUserDto,
  ) {
    await this.seoService.update(id, updateSeoDto, req.user.userId);
    return {
      message: 'Seo updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // Live ⇄ offline; the response says which way it went.
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    const { isActive } = await this.seoService.toggleActive(id, req.user.userId);
    return {
      message: isActive ? 'Seo activated successfully' : 'Seo deactivated successfully',
      isActive,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    await this.seoService.remove(id, req.user.userId);
    return {
      message: 'Seo deleted successfully',
    };
  }
}
