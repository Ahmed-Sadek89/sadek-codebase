import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Raw, Repository } from 'typeorm';
import { InstructorExperience } from './entities/instructor-experience.entity';
import { CreateInstructorExperienceDto } from './dto/create-instructor-experience.dto';
import { UpdateInstructorExperienceDto } from './dto/update-instructor-experience.dto';
import { FilterInstructorExperienceDto } from './dto/filter-instructor-experience.dto';
import { paginate } from '../common/pagination';
import { User } from '../user/entities/user.entity';
import { SkillsService } from '../skills/skills.service';

const instructorExperienceRelations = {
  user: true,
  skills: true,
} as const;

/** Rows trim skills to `{ id, name }`. */
const instructorExperienceSelect = {
  user: { id: true },
  skills: { id: true, name: true },
} as const;

@Injectable()
export class InstructorExperienceService {
  constructor(
    @InjectRepository(InstructorExperience)
    private readonly instructorExperienceRepository: Repository<InstructorExperience>,
    private readonly skillsService: SkillsService,
  ) { }

  async create(
    createInstructorExperienceDto: CreateInstructorExperienceDto,
    userId: number,
  ): Promise<InstructorExperience> {
    const { skillsIds, ...fields } = createInstructorExperienceDto;
    assertTeachingPeriod(fields.startAt, fields.endAt);

    const skills = await this.skillsService.findMoreById(skillsIds, userId);

    const instructorExperience = this.instructorExperienceRepository.create({
      ...fields,
      skills,
      user: { id: userId },
    });
    return await this.instructorExperienceRepository.save(instructorExperience);
  }

  /** The user's rows, paginated (newest first by default). */
  async findAll(query: FilterInstructorExperienceDto, userId: number) {
    return await this.findAllFor(query, { id: userId });
  }

  /**
   * Public list: the active rows of the user whose `isDefaultView` is true,
   * sorted by rank (lowest first unless `order` is DESC; ties newest first).
   */
  async findAllPublic(query: FilterInstructorExperienceDto) {
    return await this.findAllFor(
      { ...query, isActive: true, order: query.order ?? 'ASC' },
      { isDefaultView: true },
      'rank',
    );
  }

  private async findAllFor(
    query: FilterInstructorExperienceDto,
    owner: FindOptionsWhere<User>,
    sortBy?: keyof InstructorExperience,
  ) {
    const filters: FindOptionsWhere<InstructorExperience> = { user: owner };
    if (query.isActive !== undefined) filters.isActive = query.isActive;
    // A subquery rather than `skills: { id }`, which would also trim each row's
    // loaded skills down to the matching one.
    if (query.skillId !== undefined) {
      filters.id = Raw(
        (alias) =>
          `${alias} IN (SELECT "instructor_experience_id" FROM "instructor_experience_skills" WHERE "skill_id" = :skillId)`,
        { skillId: query.skillId },
      );
    }

    const search = query.search?.trim();
    const where: FindOptionsWhere<InstructorExperience> | FindOptionsWhere<InstructorExperience>[] = search
      ? [
        { ...filters, name: ILike(`%${search}%`) },
        { ...filters, coursePlatformName: ILike(`%${search}%`) },
      ]
      : filters;

    return await paginate({
      repository: this.instructorExperienceRepository,
      where,
      page: query.page,
      limit: query.limit,
      relations: instructorExperienceRelations,
      select: instructorExperienceSelect,
      order: query.order,
      sortBy,
    });
  }

  /** One of the user's rows; another user's id is "not found". */
  async findOne(id: number, userId: number): Promise<InstructorExperience> {
    const instructorExperience = await this.instructorExperienceRepository.findOne({
      where: { id, user: { id: userId } },
      relations: instructorExperienceRelations,
      select: instructorExperienceSelect,
    });
    if (!instructorExperience) {
      throw new NotFoundException(`InstructorExperience with id ${id} not found`);
    }
    return instructorExperience;
  }

  async update(
    id: number,
    updateInstructorExperienceDto: UpdateInstructorExperienceDto,
    userId: number,
  ): Promise<InstructorExperience> {
    const { skillsIds, ...fields } = updateInstructorExperienceDto;
    const instructorExperience = await this.findOne(id, userId);

    if (skillsIds) {
      instructorExperience.skills = await this.skillsService.findMoreById(skillsIds, userId);
    }

    Object.assign(instructorExperience, fields);
    assertTeachingPeriod(instructorExperience.startAt, instructorExperience.endAt);
    return await this.instructorExperienceRepository.save(instructorExperience);
  }

  /** Flips `isActive` and returns the row with its new value. */
  async toggleActive(id: number, userId: number): Promise<InstructorExperience> {
    const instructorExperience = await this.findOne(id, userId);
    const isActive = !instructorExperience.isActive;
    await this.instructorExperienceRepository.update({ id: instructorExperience.id }, { isActive });
    instructorExperience.isActive = isActive;
    return instructorExperience;
  }

  async remove(id: number, userId: number): Promise<void> {
    const instructorExperience = await this.findOne(id, userId);
    await this.instructorExperienceRepository.remove(instructorExperience);
  }
}

function assertTeachingPeriod(startAt: Date, endAt: Date): void {
  if (new Date(endAt) < new Date(startAt)) {
    throw new BadRequestException('endAt must be on or after startAt');
  }
}
