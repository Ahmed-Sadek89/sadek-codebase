import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { CategoryProjectsService } from './category-projects.service';
import { CreateCategoryProjectDto } from './dto/create-category-project.dto';
import { UpdateCategoryProjectDto } from './dto/update-category-project.dto';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { FilterCategoryProjectDto } from './dto/filter-category_projects.dto';

@ApiTags('Category Projects')
@Controller('category-projects')
export class CategoryProjectsController {
  constructor(private readonly categoryProjectsService: CategoryProjectsService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createCategoryProjectDto: CreateCategoryProjectDto,
    @Request() req: RequestUserDto,
  ) {
    const userId = req.user.userId;
    return await this.categoryProjectsService.create(createCategoryProjectDto, userId);
  }

  // Public: the default-view user's rows. Declared before ':id' so "public" is not parsed as an id.
  @Get('public')
  async findAllPublic(@Query() query: FilterCategoryProjectDto) {
    return await this.categoryProjectsService.findAllPublic(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query() query: FilterCategoryProjectDto,
    @Request() req: RequestUserDto
  ) {
    const userId = req.user.userId;
    return await this.categoryProjectsService.findAll(query, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryProjectsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryProjectDto: UpdateCategoryProjectDto) {
    await this.categoryProjectsService.update(+id, updateCategoryProjectDto);
    return {
      message: 'Category project updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoryProjectsService.remove(+id);
    return {
      message: 'Category project deleted successfully',
    };
  }
}
