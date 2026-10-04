import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { FilterProjectDto } from './dto/filter-projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: RequestUserDto
  ) {
    const userId = req.user?.userId;
    return await this.projectsService.create(createProjectDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() filterProjectsDto: FilterProjectDto,
    @Request() req: RequestUserDto
  ) {
    return await this.projectsService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: RequestUserDto
  ) {
    await this.projectsService.update(+id, updateProjectDto, req.user.userId);
    return {
      message: 'project updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(+id);
    return {
      message: 'project removed successfully',
    };
  }
}
