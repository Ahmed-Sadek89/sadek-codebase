import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { FilterPageDto } from './dto/filter-page.dto';
import { paginate } from '../common/pagination';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pagesRepository: Repository<Page>
  ) { }

  async create(createPageDto: CreatePageDto, userId: number) {
    await this.assertNamesFree(createPageDto);
    const page = this.pagesRepository.create({
      ...createPageDto,
      user: { id: userId },
    });
    return await this.pagesRepository.save(page);
  }

  async findAll(query: FilterPageDto, userId: number) {
    const owner: FindOptionsWhere<Page> = { user: { id: userId } };
    const search = query.search?.trim();
    const where: FindOptionsWhere<Page> | FindOptionsWhere<Page>[] = search
      ? [
        { ...owner, name_en: ILike(`%${search}%`) },
        { ...owner, name_ar: ILike(`%${search}%`) },
      ]
      : owner;

    return await paginate({
      repository: this.pagesRepository,
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

  async findOne(id: number, userId: number) {
    const page = await this.pagesRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!page) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }
    return page;
  }

  async update(id: number, updatePageDto: UpdatePageDto, userId: number) {
    const page = await this.findOne(id, userId);
    await this.assertNamesFree(updatePageDto, id);
    Object.assign(page, updatePageDto);
    return await this.pagesRepository.save(page);
  }

  /** Deleting a page also deletes its SEO row (seo.pageId cascades). */
  async remove(id: number, userId: number) {
    const page = await this.findOne(id, userId);
    await this.pagesRepository.remove(page);
  }

  /**
   * `name_en` and `name_ar` are each unique across all pages, so a taken name
   * is a 409 with a clear message instead of the database's 500.
   */
  private async assertNamesFree(
    { name_en, name_ar }: Partial<CreatePageDto>,
    exceptId?: number,
  ) {
    const notSelf = exceptId !== undefined ? { id: Not(exceptId) } : {};
    const checks = [
      { field: 'name_en' as const, value: name_en, label: 'English' },
      { field: 'name_ar' as const, value: name_ar, label: 'Arabic' },
    ];
    for (const { field, value, label } of checks) {
      if (value === undefined) continue;
      const taken = await this.pagesRepository.exists({
        where: { [field]: value, ...notSelf },
      });
      if (taken) {
        throw new ConflictException(`A page with the ${label} name "${value}" already exists`);
      }
    }
  }
}
