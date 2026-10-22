import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { WhatCanDo } from './entities/what-can-do.entity';
import { CreateWhatCanDoDto } from './dto/create-what-can-do.dto';
import { UpdateWhatCanDoDto } from './dto/update-what-can-do.dto';
import { FilterWhatCanDoDto } from './dto/filter-what-can-do.dto';
import { paginate } from '../common/pagination';
import { User } from '../user/entities/user.entity';

@Injectable()
export class WhatCanDoService {
  constructor(
    @InjectRepository(WhatCanDo)
    private readonly whatCanDoRepository: Repository<WhatCanDo>
  ) { }

  async create(createWhatCanDoDto: CreateWhatCanDoDto, userId: number): Promise<WhatCanDo> {
    const whatCanDo = this.whatCanDoRepository.create({
      ...createWhatCanDoDto,
      user: { id: userId },
    });
    return await this.whatCanDoRepository.save(whatCanDo);
  }

  async findAll(query: FilterWhatCanDoDto, userId: number) {
    return this.findAllFor(query, { id: userId });
  }

  /** Public list: always the rows of the user whose `isDefaultView` is true. */
  async findAllPublic(query: FilterWhatCanDoDto) {
    return this.findAllFor(query, { isDefaultView: true });
  }

  private async findAllFor(query: FilterWhatCanDoDto, owner: FindOptionsWhere<User>) {
    return await paginate({
      repository: this.whatCanDoRepository,
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

  /** The user's items, paginated by `rank`: lowest rank first unless `order` is DESC. */
  async findByUser(query: FilterWhatCanDoDto, userId: number) {
    return await paginate({
      repository: this.whatCanDoRepository,
      where: this.ownedWhere({ id: userId }, query.search),
      page: query.page,
      limit: query.limit,
      order: query.order,
    });
  }

  async findOne(id: number, userId: number): Promise<WhatCanDo> {
    const whatCanDo = await this.whatCanDoRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!whatCanDo) {
      throw new NotFoundException(`WhatCanDo with id ${id} not found`);
    }
    return whatCanDo;
  }

  async update(id: number, updateWhatCanDoDto: UpdateWhatCanDoDto, userId: number): Promise<WhatCanDo> {
    const whatCanDo = await this.findOne(id, userId);
    Object.assign(whatCanDo, updateWhatCanDoDto);
    return await this.whatCanDoRepository.save(whatCanDo);
  }

  async remove(id: number, userId: number): Promise<void> {
    const whatCanDo = await this.findOne(id, userId);
    await this.whatCanDoRepository.remove(whatCanDo);
  }

  /** The user's rows, optionally narrowed by `search` on the English or Arabic title, shortDescription or description. */
  private ownedWhere(user: FindOptionsWhere<User>, search?: string): FindOptionsWhere<WhatCanDo> | FindOptionsWhere<WhatCanDo>[] {
    const owner: FindOptionsWhere<WhatCanDo> = { user };
    search = search?.trim();
    if (!search) return owner;
    return [
      { ...owner, title_en: ILike(`%${search}%`) },
      { ...owner, title_ar: ILike(`%${search}%`) },
      { ...owner, shortDescription_en: ILike(`%${search}%`) },
      { ...owner, shortDescription_ar: ILike(`%${search}%`) },
      { ...owner, description_en: ILike(`%${search}%`) },
      { ...owner, description_ar: ILike(`%${search}%`) },
    ];
  }
}
