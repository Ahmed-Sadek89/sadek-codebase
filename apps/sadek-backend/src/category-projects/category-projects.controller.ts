import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { CategoryProjectsService } from './category-projects.service';
import { CreateCategoryProjectDto } from './dto/create-category-project.dto';
import { UpdateCategoryProjectDto } from './dto/update-category-project.dto';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { FilterCategoryProjectDto } from './dto/filter-category_projects.dto';

@Controller('category-projects')
export class CategoryProjectsController {
  constructor(private readonly categoryProjectsService: CategoryProjectsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCategoryProjectDto: CreateCategoryProjectDto,
    @Request() req: RequestUserDto,
  ) {
    const userId = req.user.userId;
    return await this.categoryProjectsService.create(createCategoryProjectDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterCategoryProjectDto: FilterCategoryProjectDto,
    @Request() req: RequestUserDto
  ) {
    const userId = req.user.userId;
    return await this.categoryProjectsService.findAll(filterCategoryProjectDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryProjectsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryProjectDto: UpdateCategoryProjectDto) {
    await this.categoryProjectsService.update(+id, updateCategoryProjectDto);
    return {
      message: 'Category project updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoryProjectsService.remove(+id);
    return {
      message: 'Category project deleted successfully',
    };
  }
}
