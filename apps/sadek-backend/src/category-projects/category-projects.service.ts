import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { CategoryProject } from './entities/category-project.entity';
import { CreateCategoryProjectDto } from './dto/create-category-project.dto';
import { UpdateCategoryProjectDto } from './dto/update-category-project.dto';
import { FilterCategoryProjectDto } from './dto/filter-category_projects.dto';
import { paginate } from '../common/pagination';

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

  async findAll(
    filterCategoryProjectDto: FilterCategoryProjectDto,
    userId: number
  ) {
    const filters: FindOptionsWhere<CategoryProject> = {
      user: { id: userId },
    };

    if (filterCategoryProjectDto.isActive !== undefined) {
      filters.isActive = filterCategoryProjectDto.isActive;
    }

    const search = filterCategoryProjectDto.search?.trim();

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
      page: filterCategoryProjectDto.page,
      limit: filterCategoryProjectDto.limit,
      relations: { user: true },
      select: {
        user: { id: true },
      },
      order: filterCategoryProjectDto.order,
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

  async remove(id: number): Promise<void> {
    const result = await this.categoryProjectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CategoryProject with id ${id} not found`);
    }
  }
}
