import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
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
    const { nameAr, nameEn, avatar_url, isActive, categorySkillsIds } = createSkillDto;
    const categorySkills = await this.categorySkillsService.findMoreById(
      categorySkillsIds,
      userId,
    );

    const skill = this.skillRepository.create({
      nameAr,
      nameEn,
      avatar_url,
      isActive,
      user: { id: userId },
      categorySkills,
    });

    return await this.skillRepository.save(skill);
  }

  async findAll(query: FilterSkillDto, userId: number) {
    return this.findAllFor(query, { id: userId });
  }

  /** Public list: always the rows of the user whose `isDefaultView` is true. */
  async findAllPublic(query: FilterSkillDto) {
    return this.findAllFor(query, { isDefaultView: true });
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
      if (Array.isArray(where)) {
        where = [
          { ...where[0], nameAr: ILike(`%${search}%`) },
          { ...where[0], nameEn: ILike(`%${search}%`) }
        ];
      } else {
        where = [
          { ...where, nameAr: ILike(`%${search}%`) },
          { ...where, nameEn: ILike(`%${search}%`) }
        ];
      }
    }

    return paginate({
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

    if (updateSkillDto.nameAr !== undefined) skill.nameAr = updateSkillDto.nameAr;
    if (updateSkillDto.nameEn !== undefined) skill.nameEn = updateSkillDto.nameEn;
    if (updateSkillDto.avatar_url !== undefined) skill.avatar_url = updateSkillDto.avatar_url;
    if (updateSkillDto.isActive !== undefined) skill.isActive = updateSkillDto.isActive;

    if (updateSkillDto.categorySkillsIds?.length) {
      skill.categorySkills = await this.categorySkillsService.findMoreById(
        updateSkillDto.categorySkillsIds,
        userId,
      );
    }

    return await this.skillRepository.save(skill);
  }

  async remove(id: number, userId: number) {
    const skill = await this.findOne(id, userId);
    await this.skillRepository.remove(skill);
    return { message: `Skill with id ${id} has been removed.` };
  }
}
