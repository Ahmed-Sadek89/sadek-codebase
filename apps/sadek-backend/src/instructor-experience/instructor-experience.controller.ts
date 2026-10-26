import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { InstructorExperienceService } from './instructor-experience.service';
import { CreateInstructorExperienceDto } from './dto/create-instructor-experience.dto';
import { UpdateInstructorExperienceDto } from './dto/update-instructor-experience.dto';
import { FilterInstructorExperienceDto } from './dto/filter-instructor-experience.dto';
import { RequestUserDto } from '../auth/dto/request-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';

@ApiTags('Instructor Experience')
@Controller('instructor-experience')
export class InstructorExperienceController {
  constructor(private readonly instructorExperienceService: InstructorExperienceService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createInstructorExperienceDto: CreateInstructorExperienceDto,
    @Request() req: RequestUserDto,
  ) {
    return await this.instructorExperienceService.create(createInstructorExperienceDto, req.user.userId);
  }

  // Public: the default-view user's active rows by rank. Declared before ':id' so "public" is not parsed as an id.
  @Get('public')
  async findAllPublic(@Query() query: FilterInstructorExperienceDto) {
    return await this.instructorExperienceService.findAllPublic(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterInstructorExperienceDto, @Request() req: RequestUserDto) {
    return await this.instructorExperienceService.findAll(query, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.instructorExperienceService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstructorExperienceDto: UpdateInstructorExperienceDto,
    @Request() req: RequestUserDto,
  ) {
    await this.instructorExperienceService.update(id, updateInstructorExperienceDto, req.user.userId);
    return {
      message: 'Instructor experience updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // Active ⇄ inactive; the response says which way it went.
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    const { isActive } = await this.instructorExperienceService.toggleActive(id, req.user.userId);
    return {
      message: isActive
        ? 'Instructor experience activated successfully'
        : 'Instructor experience deactivated successfully',
      isActive,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    await this.instructorExperienceService.remove(id, req.user.userId);
    return {
      message: 'Instructor experience deleted successfully',
    };
  }
}
