import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { CreateCategorySkillDto } from './dto/create-category_skill.dto';
import { UpdateCategorySkillDto } from './dto/update-category_skill.dto';
import { CategorySkill } from './entities/category_skill.entity';
import { FilterCategorySkillDto } from './dto/filter-category_skills.dto';
import { paginate } from '../common/pagination';
import { SkillsService } from '../skills/skills.service';

@Injectable()
export class CategorySkillsService {
  constructor(
    @Inject(forwardRef(() => SkillsService))
    private readonly skillsService: SkillsService,
    @InjectRepository(CategorySkill)
    private readonly categorySkillRepository: Repository<CategorySkill>,

  ) { }

  async create(createCategorySkillDto: CreateCategorySkillDto, userId: number): Promise<CategorySkill> {
    const user = await this.categorySkillRepository.manager.findOne("users", {
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const categorySkill = this.categorySkillRepository.create({
      ...createCategorySkillDto,
      user: { id: userId },
    });

    return await this.categorySkillRepository.save(categorySkill);
  }

  async findAll(
    filterCategorySkillDto: FilterCategorySkillDto,
    userId: number
  ) {
    const filters: FindOptionsWhere<CategorySkill> = {
      user: { id: userId },
    };

    if (filterCategorySkillDto.isActive !== undefined) {
      filters.isActive = filterCategorySkillDto.isActive;
    }

    const search = filterCategorySkillDto.search?.trim();

    let where: FindOptionsWhere<CategorySkill> | FindOptionsWhere<CategorySkill>[];
    if (search) {
      where = [
        { ...filters, nameAr: ILike(`%${search}%`) },
        { ...filters, nameEn: ILike(`%${search}%`) },
      ];
    } else {
      where = filters;
    }

    return paginate({
      repository: this.categorySkillRepository,
      where,
      page: filterCategorySkillDto.page,
      limit: filterCategorySkillDto.limit,
      relations: { user: true },
      select: {
        user: { id: true },
      },
      order: filterCategorySkillDto.order,
    });
  }

  async findOne(id: number): Promise<{ id: number, skills: number }> {
    const categorySkill = await this.categorySkillRepository.findOne({
      where: { id },
      relations: { user: true, skills: true },
      select: { user: { id: true } },
    });

    if (!categorySkill) {
      throw new NotFoundException(`CategorySkill with id ${id} not found`);
    }
    const skillsCount = await this.skillsService.findCountByCategoryId(id)

    return { ...categorySkill, skills: skillsCount };
  }


  async findMoreById(categorySkillsIds: number[], userId: number): Promise<CategorySkill[]> {
    const ids = [...new Set(categorySkillsIds)];
    const foundedCategorySkills = await this.categorySkillRepository.findBy({
      id: In(ids),
      user: { id: userId }
    });

    if (foundedCategorySkills.length !== ids.length) {
      throw new BadRequestException('One or more categorySkillsIds are invalid');
    }

    return foundedCategorySkills;
  }



  async update(id: number, updateCategorySkillDto: UpdateCategorySkillDto): Promise<void> {
    const categorySkill = await this.categorySkillRepository.update(id, updateCategorySkillDto);
    if (categorySkill.affected === 0) {
      throw new NotFoundException(`CategorySkill with id ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    const categorySkill = await this.categorySkillRepository.findOne({
      where: { id },
      relations: { skills: true },
    });

    if (!categorySkill) {
      throw new NotFoundException(`CategorySkill with id ${id} not found`);
    }

    if (categorySkill.skills && categorySkill.skills.length > 0) {
      throw new BadRequestException(`Cannot delete CategorySkill with id ${id} because it still has associated skills`);
    }

    const result = await this.categorySkillRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CategorySkill with id ${id} not found`);
    }
  }
}
