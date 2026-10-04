import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseGuards, Request } from '@nestjs/common';
import { CategorySkillsService } from './category_skills.service';
import { CreateCategorySkillDto } from './dto/create-category_skill.dto';
import { UpdateCategorySkillDto } from './dto/update-category_skill.dto';
import { FilterCategorySkillDto } from './dto/filter-category_skills.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';

@Controller('category-skills')
export class CategorySkillsController {
  constructor(private readonly categorySkillsService: CategorySkillsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCategorySkillDto: CreateCategorySkillDto,
    @Request() req: RequestUserDto
  ) {
    return await this.categorySkillsService.create(createCategorySkillDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("private")
  async findAll(
    @Query() filterCategorySkillDto: FilterCategorySkillDto,
    @Request() req: RequestUserDto
  ) {
    return await this.categorySkillsService.findAll(filterCategorySkillDto, req.user.userId);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categorySkill = await this.categorySkillsService.findOne(+id);
    if (!categorySkill) {
      throw new NotFoundException(`CategorySkill with id ${id} not found`);
    }
    return categorySkill;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategorySkillDto: UpdateCategorySkillDto) {
    await this.categorySkillsService.update(+id, updateCategorySkillDto);
    return {
      message: `CategorySkill with id ${id} has been updated.`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categorySkillsService.remove(+id);
    return {
      message: `CategorySkill with id ${id} has been removed.`,
    };
  }
}
