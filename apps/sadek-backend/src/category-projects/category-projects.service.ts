import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { CategoryProject } from './entities/category-project.entity';
import { CreateCategoryProjectDto } from './dto/create-category-project.dto';
import { UpdateCategoryProjectDto } from './dto/update-category-project.dto';
import { FilterCategoryProjectDto } from './dto/filter-category_projects.dto';
import { paginate } from '../common/pagination';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CategoryProjectsService {
  constructor(
    @InjectRepository(CategoryProject)
    private readonly categoryProjectRepository: Repository<CategoryProject>
  ) { }

  async create(
    createCategoryProjectDto: CreateCategoryProjectDto,
    userId: number,
  ): Promise<CategoryProject> {

    const categoryProject = this.categoryProjectRepository.create({
      ...createCategoryProjectDto,
      user: { id: userId },
    });

    return await this.categoryProjectRepository.save(categoryProject);
  }

  async findAll(query: FilterCategoryProjectDto, userId: number) {
    return await this.findAllFor(query, { id: userId });
  }

  /** Public list: always the rows of the user whose `isDefaultView` is true. */
  async findAllPublic(query: FilterCategoryProjectDto) {
    // Sorted by rank, not createdAt; `order` sets the direction (the DTO
    // defaults it to DESC, so the website sends ASC for lowest rank first).
    return await this.findAllFor(query, { isDefaultView: true }, 'rank');
  }

  private async findAllFor(
    query: FilterCategoryProjectDto,
    owner: FindOptionsWhere<User>,
    sortBy?: keyof CategoryProject,
  ) {
    const filters: FindOptionsWhere<CategoryProject> = {
      user: owner,
    };

    if (query.isActive !== undefined) {
      filters.isActive = query.isActive;
    }

    const search = query.search?.trim();

    let where: FindOptionsWhere<CategoryProject> | FindOptionsWhere<CategoryProject>[];
    if (search) {
      where = [
        { ...filters, nameAr: ILike(`%${search}%`) },
        { ...filters, nameEn: ILike(`%${search}%`) },
      ];
    } else {
      where = filters;
    }

    return await paginate({
      repository: this.categoryProjectRepository,
      where,
      page: query.page,
      limit: query.limit,
      relations: { user: true },
      select: {
        user: { id: true },
      },
      order: query.order,
      sortBy,
    });
  }

  async findOne(id: number): Promise<CategoryProject> {
    const categoryProject = await this.categoryProjectRepository.findOne({
      where: { id },
    });
    if (!categoryProject) {
      throw new NotFoundException(`CategoryProject with id ${id} not found`);
    }
    return categoryProject;
  }

  async findMoreById(categoryprojectsIds: number[], userId: number): Promise<CategoryProject[]> {
    const ids = [...new Set(categoryprojectsIds)];
    const foundedCategoryProjects = await this.categoryProjectRepository.findBy({
      id: In(ids),
      user: { id: userId }
    });

    if (foundedCategoryProjects.length !== ids.length) {
      throw new BadRequestException('One or more categorySkillsIds are invalid');
    }

    return foundedCategoryProjects;
  }

  async update(
    id: number,
    updateCategoryProjectDto: UpdateCategoryProjectDto,
  ): Promise<void> {
    const categoryProject = await this.categoryProjectRepository.update(id, updateCategoryProjectDto);
    if (categoryProject.affected === 0) {
      throw new NotFoundException(`CategoryProject with id ${id} not found`);
    }
  }

  /** Flips `isActive` on one of the user's categories and returns the row with its new value. */
  async toggleActive(id: number, userId: number): Promise<CategoryProject> {
    const categoryProject = await this.categoryProjectRepository.findOneBy({ id, user: { id: userId } });
    if (!categoryProject) {
      throw new NotFoundException(`CategoryProject with id ${id} not found`);
    }
    const isActive = !categoryProject.isActive;
    await this.categoryProjectRepository.update({ id }, { isActive });
    categoryProject.isActive = isActive;
    return categoryProject;
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryProjectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CategoryProject with id ${id} not found`);
    }
  }
}
