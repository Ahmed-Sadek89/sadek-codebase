import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCompany } from './entities/user-company.entity';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { paginate } from '../common/pagination';

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

  async findAll(query: PaginationQueryDto, userId: number) {
    return await paginate({
      repository: this.userCompanyRepository,
      where: { user: { id: userId } },
      page: query.page,
      limit: query.limit,
      relations: { user: true },
      select: {
        user: { id: true },
      },
      order: query.order,
    });
  }

  /** Every company of the user, latest job first (for the portfolio timeline). */
  async findByUser(userId: number): Promise<UserCompany[]> {
    return await this.userCompanyRepository.find({
      where: { user: { id: userId } },
      order: { startWorkFrom: 'DESC' },
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
}

function assertWorkPeriod(from: Date, to?: Date | null): void {
  if (to && new Date(to) < new Date(from)) {
    throw new BadRequestException('startWorkTo must be on or after startWorkFrom');
  }
}
