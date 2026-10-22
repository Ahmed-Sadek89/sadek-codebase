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
    return this.findAllFor(query, { id: userId });
  }

  /** Public list: always the rows of the user whose `isDefaultView` is true. */
  async findAllPublic(query: FilterUserCompanyDto) {
    return this.findAllFor(query, { isDefaultView: true });
  }

  private async findAllFor(query: FilterUserCompanyDto, owner: FindOptionsWhere<User>) {
    return await paginate({
      repository: this.userCompanyRepository,
      where: this.ownedWhere(owner, query.search),
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
    return await paginate({
      repository: this.userCompanyRepository,
      where: this.ownedWhere({ id: userId }, query.search),
      page: query.page,
      limit: query.limit,
      order: query.order
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

  async remove(id: number, userId: number): Promise<void> {
    const userCompany = await this.findOne(id, userId);
    await this.userCompanyRepository.remove(userCompany);
  }

  /** The user's rows, optionally narrowed by `search` on the English or Arabic name or description. */
  private ownedWhere(user: FindOptionsWhere<User>, search?: string): FindOptionsWhere<UserCompany> | FindOptionsWhere<UserCompany>[] {
    const owner: FindOptionsWhere<UserCompany> = { user };
    search = search?.trim();
    if (!search) return owner;
    return [
      { ...owner, name_en: ILike(`%${search}%`) },
      { ...owner, name_ar: ILike(`%${search}%`) },
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
