import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UserCompany } from './entities/user-company.entity';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';
import { FilterUserCompanyDto } from './dto/filter-user-company.dto';
import { paginate } from '../common/pagination';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(UserCompany)
    private readonly userCompanyRepository: Repository<UserCompany>
  ) { }

  async create(createUserCompanyDto: CreateUserCompanyDto, userId: number): Promise<UserCompany> {
    assertWorkPeriod(createUserCompanyDto.startWorkFrom, createUserCompanyDto.startWorkTo);

    const userCompany = this.userCompanyRepository.create({
      ...createUserCompanyDto,
      user: { id: userId },
    });
    return await this.userCompanyRepository.save(userCompany);
  }

  async findAll(query: FilterUserCompanyDto, userId: number) {
    return await this.findAllFor(query, { id: userId });
  }

  /** Public list: always the active rows of the user whose `isDefaultView` is true. */
  async findAllPublic(query: FilterUserCompanyDto) {
    return await this.findAllFor({ ...query, isActive: true }, { isDefaultView: true });
  }

  private async findAllFor(query: FilterUserCompanyDto, owner: FindOptionsWhere<User>) {
    const where = this.ownedWhere(owner, query.search, query.isActive);
    return await paginate({
      repository: this.userCompanyRepository,
      where,
      page: query.page,
      limit: query.limit,
      relations: { user: true },
      select: {
        user: { id: true },
      },
      order: query.order,
    });
  }

  /** The user's companies, paginated by `startWorkFrom`: latest job first unless `order` is ASC. */
  async findByUser(query: FilterUserCompanyDto, userId: number) {
    const where = this.ownedWhere({ id: userId }, query.search, query.isActive);
    return await paginate({
      repository: this.userCompanyRepository,
      where,
      page: query.page,
      limit: query.limit,
      order: query.order,
    });
  }

  async findOne(id: number, userId: number): Promise<UserCompany> {
    const userCompany = await this.userCompanyRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!userCompany) {
      throw new NotFoundException(`UserCompany with id ${id} not found`);
    }
    return userCompany;
  }

  async update(id: number, updateUserCompanyDto: UpdateUserCompanyDto, userId: number): Promise<UserCompany> {
    const userCompany = await this.findOne(id, userId);
    Object.assign(userCompany, updateUserCompanyDto);
    assertWorkPeriod(userCompany.startWorkFrom, userCompany.startWorkTo);
    return await this.userCompanyRepository.save(userCompany);
  }

  /** Flips `isActive` and returns the row with its new value. */
  async toggleActive(id: number, userId: number): Promise<UserCompany> {
    const userCompany = await this.findOne(id, userId);
    const isActive = !userCompany.isActive;
    await this.userCompanyRepository.update({ id: userCompany.id }, { isActive });
    userCompany.isActive = isActive;
    return userCompany;
  }

  async remove(id: number, userId: number): Promise<void> {
    const userCompany = await this.findOne(id, userId);
    await this.userCompanyRepository.remove(userCompany);
  }

  /**
   * The user's rows, optionally narrowed by `isActive` and by `search` on the
   * company name or the English or Arabic description.
   */
  private ownedWhere(
    user: FindOptionsWhere<User>,
    search?: string,
    isActive?: boolean,
  ): FindOptionsWhere<UserCompany> | FindOptionsWhere<UserCompany>[] {
    const owner: FindOptionsWhere<UserCompany> = { user };
    if (isActive !== undefined) owner.isActive = isActive;
    search = search?.trim();
    if (!search) return owner;
    return [
      { ...owner, company_name: ILike(`%${search}%`) },
      { ...owner, description_en: ILike(`%${search}%`) },
      { ...owner, description_ar: ILike(`%${search}%`) },
    ];
  }
}

function assertWorkPeriod(from: Date, to?: Date | null): void {
  if (to && new Date(to) < new Date(from)) {
    throw new BadRequestException('startWorkTo must be on or after startWorkFrom');
  }
}
