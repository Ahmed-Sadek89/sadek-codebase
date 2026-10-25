import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { CreateManySkillsDto } from './dto/create-many-skills.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { FilterSkillDto } from './dto/filter-skill.dto';
import { CategorySkillsService } from '../category_skills/category_skills.service';
import { paginate } from '../common/pagination';
import { User } from '../user/entities/user.entity';

const skillRelations = {
  user: true,
  categorySkills: true,
} as const;

const skillSelect = {
  user: { id: true },
  categorySkills: {
    id: true,
    nameAr: true,
    nameEn: true,
  },
} as const;

@Injectable()
export class SkillsService {
  constructor(
    @Inject(forwardRef(() => CategorySkillsService))
    private readonly categorySkillsService: CategorySkillsService,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) { }

  async create(createSkillDto: CreateSkillDto, userId: number) {
    const { name, isActive, categorySkillsIds } = createSkillDto;
    const categorySkills = await this.categorySkillsService.findMoreById(
      categorySkillsIds,
      userId,
    );

    const skill = this.skillRepository.create({
      name,
      isActive,
      user: { id: userId },
      categorySkills,
    });

    return await this.skillRepository.save(skill);
  }

  /** Saves every name as its own skill, all with the same categories, in one transaction. */
  async createMany(
    createManySkillsDto: CreateManySkillsDto,
    userId: number,
  ) {
    const { names, isActive, categorySkillsIds } = createManySkillsDto;

    const uniqueNames = [...new Set(names.map(name => name.trim()))];

    const categorySkills =
      await this.categorySkillsService.findMoreById(
        categorySkillsIds,
        userId,
      );

    const skills = this.skillRepository.create(
      uniqueNames.map(name => ({
        name,
        isActive,
        user: { id: userId },
        categorySkills,
      })),
    );

    return this.skillRepository.save(skills);
  }

  async findAll(query: FilterSkillDto, userId: number) {
    return await this.findAllFor(query, { id: userId });
  }

  /**
   * Public: up to `limit` active skills of one category, owned by the user
   * whose `isDefaultView` is true, newest first. Used by GET /category-skills/public.
   */
  async findPublicByCategory(categoryId: number, limit: number) {
    return await this.skillRepository.find({
      where: {
        isActive: true,
        user: { isDefaultView: true },
        categorySkills: { id: categoryId },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  private async findAllFor(query: FilterSkillDto, owner: FindOptionsWhere<User>) {
    const filters: FindOptionsWhere<Skill> = {
      user: owner,
    };

    if (query.isActive !== undefined) {
      filters.isActive = query.isActive;
    }

    let where: FindOptionsWhere<Skill> | FindOptionsWhere<Skill>[] = filters;

    if (query.categoryId !== undefined) {
      where = [
        {
          ...filters,
          categorySkills: {
            id: query.categoryId,
          },
        },
      ];
    }

    const search = query.search?.trim();
    if (search) {
      where = Array.isArray(where)
        ? [{ ...where[0], name: ILike(`%${search}%`) }]
        : { ...where, name: ILike(`%${search}%`) };
    }

    return await paginate({
      repository: this.skillRepository,
      where,
      page: query.page,
      limit: query.limit,
      relations: skillRelations,
      select: skillSelect,
      order: query.order,
    });
  }

  async findCountByCategoryId(categoryId: number) {
    const skillsCount = await this.skillRepository.count({
      where: {
        categorySkills: {
          id: categoryId,
        },
      },
    });
    return skillsCount
  }

  async findOne(id: number, userId: number) {
    const skill = await this.skillRepository.findOne({
      where: { id, user: { id: userId } },
      relations: skillRelations,
      select: skillSelect,
    });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto, userId: number) {
    const skill = await this.findOne(id, userId);

    if (updateSkillDto.name !== undefined) skill.name = updateSkillDto.name;
    if (updateSkillDto.isActive !== undefined) skill.isActive = updateSkillDto.isActive;

    if (updateSkillDto.categorySkillsIds?.length) {
      skill.categorySkills = await this.categorySkillsService.findMoreById(
        updateSkillDto.categorySkillsIds,
        userId,
      );
    }

    return await this.skillRepository.save(skill);
  }

  /** Flips `isActive` on one of the user's skills and returns the row with its new value. */
  async toggleActive(id: number, userId: number): Promise<Skill> {
    const skill = await this.skillRepository.findOneBy({ id, user: { id: userId } });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    const isActive = !skill.isActive;
    await this.skillRepository.update({ id }, { isActive });
    skill.isActive = isActive;
    return skill;
  }

  async remove(id: number, userId: number) {
    const skill = await this.findOne(id, userId);
    await this.skillRepository.remove(skill);
    return { message: `Skill with id ${id} has been removed.` };
  }
}
