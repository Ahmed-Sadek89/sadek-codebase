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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { CreateManySkillsDto } from './dto/create-many-skills.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { FilterSkillDto } from './dto/filter-skill.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RequestUserDto } from '../auth/dto/request-user.dto';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createSkillDto: CreateSkillDto, @Request() req: RequestUserDto) {
    return await this.skillsService.create(createSkillDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // All or nothing: one bad name or category id saves none of them.
  @Post('bulk')
  async createMany(@Body() createManySkillsDto: CreateManySkillsDto, @Request() req: RequestUserDto) {
    return await this.skillsService.createMany(createManySkillsDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FilterSkillDto, @Request() req: RequestUserDto) {
    return await this.skillsService.findAll(query, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.skillsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkillDto: UpdateSkillDto,
    @Request() req: RequestUserDto,
  ) {
    return await this.skillsService.update(id, updateSkillDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // Active ⇄ inactive; the response says which way it went.
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    const { isActive } = await this.skillsService.toggleActive(id, req.user.userId);
    return {
      message: isActive ? 'Skill activated successfully' : 'Skill deactivated successfully',
      isActive,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.skillsService.remove(id, req.user.userId);
  }
}
