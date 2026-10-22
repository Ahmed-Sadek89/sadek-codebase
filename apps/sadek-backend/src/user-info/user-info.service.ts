import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';
import { CreateUserInfoDto } from './dto/create-user-info.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { FilterUserInfoDto } from './dto/filter-user-info.dto';
import { User } from '../user/entities/user.entity';
import { paginate } from '../common/pagination';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>
  ) { }

  async create(createUserInfoDto: CreateUserInfoDto, userId: number): Promise<UserInfo> {
    // One-to-one: a user can own a single user-info row.
    const exists = await this.userInfoRepository.exists({ where: { user: { id: userId } } });
    if (exists) {
      throw new ConflictException('User info already exists for this user');
    }

    const userInfo = this.userInfoRepository.create({
      ...createUserInfoDto,
      user: { id: userId },
    });
    return await this.userInfoRepository.save(userInfo);
  }

  async findAll(query: FilterUserInfoDto) {
    return await this.findAllFor(query);
  }

  /** Public list: only the info of the user whose `isDefaultView` is true. */
  async findAllPublic(query: FilterUserInfoDto) {
    return await this.findAllFor(query, { isDefaultView: true });
  }

  private async findAllFor(query: FilterUserInfoDto, user?: FindOptionsWhere<User>) {
    const filters: FindOptionsWhere<UserInfo> = user ? { user } : {};
    const search = query.search?.trim();
    const where: FindOptionsWhere<UserInfo> | FindOptionsWhere<UserInfo>[] = search
      ? [
        { ...filters, headTitle_en: ILike(`%${search}%`) },
        { ...filters, headTitle_ar: ILike(`%${search}%`) },
        { ...filters, shortDescription_en: ILike(`%${search}%`) },
        { ...filters, shortDescription_ar: ILike(`%${search}%`) },
      ]
      : filters;

    return await paginate({
      repository: this.userInfoRepository,
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

  async findOne(id: number): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({ where: { id } });
    if (!userInfo) {
      throw new NotFoundException(`UserInfo with id ${id} not found`);
    }
    return userInfo;
  }

  async findByUser(userId: number): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!userInfo) {
      throw new NotFoundException(`UserInfo for user ${userId} not found`);
    }
    return userInfo;
  }

  async update(id: number, updateUserInfoDto: UpdateUserInfoDto): Promise<void> {
    const result = await this.userInfoRepository.update(id, updateUserInfoDto);
    if (result.affected === 0) {
      throw new NotFoundException(`UserInfo with id ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.userInfoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`UserInfo with id ${id} not found`);
    }
  }
}
