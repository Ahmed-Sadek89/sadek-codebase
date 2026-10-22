import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { FilterProjectDto } from './dto/filter-projects.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: RequestUserDto
  ) {
    const userId = req.user?.userId;
    return await this.projectsService.create(createProjectDto, userId);
  }

  // Public: the default-view user's rows. Declared before ':id' so "public" is not parsed as an id.
  @Get('public')
  async findAllPublic(@Query() query: FilterProjectDto) {
    return await this.projectsService.findAllPublic(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query() filterProjectsDto: FilterProjectDto,
    @Request() req: RequestUserDto
  ) {
    return await this.projectsService.findAll(filterProjectsDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.projectsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: RequestUserDto
  ) {
    await this.projectsService.update(id, updateProjectDto, req.user.userId);
    return {
      message: 'project updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    await this.projectsService.remove(id, req.user.userId);
    return {
      message: 'project removed successfully',
    };
  }
}
