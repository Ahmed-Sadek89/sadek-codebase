import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { CategoryProjectsService } from '../category-projects/category-projects.service';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(forwardRef(() => CategoryProjectsService))
    private readonly categoryProjectsService: CategoryProjectsService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {

    const categoryProjects =
      await this.categoryProjectsService.findMoreById(createProjectDto.categoryProjectsIds, userId)

    const project = this.projectRepository.create({
      ...createProjectDto,
      categoryProjects,
      user: { id: userId },
    });

    return this.projectRepository.save(project);
  }

  async findAll(userId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        user: { id: userId }
      },
      relations: {
        user: true,
        categoryProjects: true
      },
      select: {
        user: {
          id: true,
        },
        categoryProjects: {
          id: true,
          nameAr: true,
          nameEn: true
        }
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: {
        user: true,
        categoryProjects: true
      },
      select: {
        user: { id: true }
      }
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<Project> {
    const project = await this.findOne(id)

    if (updateProjectDto.categoryProjectsIds) {
      const categoryProjects =
        await this.categoryProjectsService.findMoreById(updateProjectDto.categoryProjectsIds, userId)
      project.categoryProjects = categoryProjects;
    }

    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);

  }

  async remove(id: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    await this.projectRepository.remove(project);
  }
}
