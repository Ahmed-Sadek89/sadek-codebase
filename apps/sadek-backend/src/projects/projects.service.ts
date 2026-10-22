import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectDto } from './dto/filter-projects.dto';
import { Project } from './entities/project.entity';
import { CategoryProjectsService } from '../category-projects/category-projects.service';
import { paginate } from '../common/pagination';
import { User } from '../user/entities/user.entity';

const projectRelations = {
  user: true,
  categoryProjects: true,
} as const;

/** List rows trim categories to `{ id, nameAr, nameEn }`. */
const projectListSelect = {
  user: { id: true },
  categoryProjects: {
    id: true,
    nameAr: true,
    nameEn: true,
  },
} as const;

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

  /**
   * The user's projects, paginated (newest first by default). Optional
   * filters: `search` (nameAr or nameEn, case-insensitive), `isActive`,
   * and `categoryId`.
   */
  async findAll(query: FilterProjectDto, userId: number) {
    return await this.findAllFor(query, { id: userId });
  }

  /** Public list: always the rows of the user whose `isDefaultView` is true. */
  async findAllPublic(query: FilterProjectDto) {
    return await this.findAllFor(query, { isDefaultView: true });
  }

  private async findAllFor(query: FilterProjectDto, owner: FindOptionsWhere<User>) {
    const filters: FindOptionsWhere<Project> = {
      user: owner,
    };

    if (query.isActive !== undefined) {
      filters.isActive = query.isActive;
    }

    if (query.categoryId !== undefined) {
      filters.categoryProjects = { id: query.categoryId };
    }

    const search = query.search?.trim();
    const where: FindOptionsWhere<Project> | FindOptionsWhere<Project>[] = search
      ? [
        { ...filters, nameAr: ILike(`%${search}%`) },
        { ...filters, nameEn: ILike(`%${search}%`) },
      ]
      : filters;

    return await paginate({
      repository: this.projectRepository,
      where,
      page: query.page,
      limit: query.limit,
      relations: projectRelations,
      select: projectListSelect,
      order: query.order,
    });
  }

  /** One of the user's projects; another user's id is "not found". */
  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, user: { id: userId } },
      relations: projectRelations,
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
    const project = await this.findOne(id, userId);

    if (updateProjectDto.categoryProjectsIds) {
      const categoryProjects =
        await this.categoryProjectsService.findMoreById(updateProjectDto.categoryProjectsIds, userId)
      project.categoryProjects = categoryProjects;
    }

    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);

  }

  async remove(id: number, userId: number): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectRepository.remove(project);
  }
}
