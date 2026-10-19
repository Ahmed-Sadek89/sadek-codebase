import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatCanDo } from './entities/what-can-do.entity';
import { CreateWhatCanDoDto } from './dto/create-what-can-do.dto';
import { UpdateWhatCanDoDto } from './dto/update-what-can-do.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { paginate } from '../common/pagination';

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

  async findAll(query: PaginationQueryDto, userId: number) {
    return await paginate({
      repository: this.whatCanDoRepository,
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

  /** Every item of the user, in display order (lowest rank first). */
  async findByUser(userId: number): Promise<WhatCanDo[]> {
    return await this.whatCanDoRepository.find({
      where: { user: { id: userId } },
      order: { rank: 'ASC', id: 'ASC' },
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
}
