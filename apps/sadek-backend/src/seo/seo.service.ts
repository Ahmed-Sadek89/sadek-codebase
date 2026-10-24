import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { SeoPageName } from '@repo/constants/seo-pages';
import { Seo } from './entities/seo.entity';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { FilterSeoDto } from './dto/filter-seo.dto';
import { paginate } from '../common/pagination';

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(Seo)
    private readonly seoRepository: Repository<Seo>
  ) { }

  async create(createSeoDto: CreateSeoDto, userId: number) {
    await this.assertPageNameFree(createSeoDto.pageName);
    // A page's first row goes live right away, so the website always has one.
    const hasActive = await this.hasActiveRow(userId, createSeoDto.pageName);
    const seo = this.seoRepository.create({
      ...createSeoDto,
      isActive: !hasActive,
      user: { id: userId },
    });
    return await this.seoRepository.save(seo);
  }

  async findAll(query: FilterSeoDto, userId: number) {
    const filters: FindOptionsWhere<Seo> = { user: { id: userId } };
    if (query.isActive !== undefined) {
      filters.isActive = query.isActive;
    }
    if (query.pageName !== undefined) {
      filters.pageName = query.pageName;
    }

    const search = query.search?.trim();
    const where: FindOptionsWhere<Seo> | FindOptionsWhere<Seo>[] = search
      ? [
        { ...filters, metaTitle_en: ILike(`%${search}%`) },
        { ...filters, metaTitle_ar: ILike(`%${search}%`) },
      ]
      : filters;

    return await paginate({
      repository: this.seoRepository,
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

  /** Public: the active row for `pageName` of the user whose `isDefaultView` is true. */
  async findPublic(pageName: SeoPageName): Promise<Seo> {
    const seo = await this.seoRepository.findOne({
      where: { pageName, isActive: true, user: { isDefaultView: true } },
    });
    if (!seo) {
      throw new NotFoundException(`No active SEO found for page ${pageName}`);
    }
    return seo;
  }

  async findOne(id: number, userId: number) {
    const seo = await this.seoRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!seo) {
      throw new NotFoundException(`Seo with id ${id} not found`);
    }
    return seo;
  }

  async update(id: number, updateSeoDto: UpdateSeoDto, userId: number) {
    const seo = await this.findOne(id, userId);
    if (updateSeoDto.pageName !== undefined && updateSeoDto.pageName !== seo.pageName) {
      await this.assertPageNameFree(updateSeoDto.pageName, id);
    }
    // A live row moved to another page stays live only if that page has none.
    if (
      updateSeoDto.pageName !== undefined &&
      updateSeoDto.pageName !== seo.pageName &&
      seo.isActive
    ) {
      seo.isActive = !(await this.hasActiveRow(userId, updateSeoDto.pageName, id));
    }
    Object.assign(seo, updateSeoDto);
    return await this.seoRepository.save(seo);
  }

  /**
   * Toggles `isActive`: a live row goes offline, an offline row goes live.
   * Going live first deactivates the user's other rows for the same page (in
   * one transaction), so a page never has two live rows.
   */
  async toggleActive(id: number, userId: number) {
    const seo = await this.findOne(id, userId);
    const isActive = !seo.isActive;
    await this.seoRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(Seo);
      if (isActive) {
        await repository.update(
          { user: { id: userId }, pageName: seo.pageName, isActive: true },
          { isActive: false },
        );
      }
      await repository.update({ id: seo.id }, { isActive });
    });
    seo.isActive = isActive;
    return seo;
  }

  /**
   * `pageName` is unique: each website page has one SEO row (for every user),
   * so a taken page is a 409 with a clear message instead of the database's 500.
   */
  private async assertPageNameFree(pageName: SeoPageName, exceptId?: number) {
    const existing = await this.seoRepository.findOne({
      where: { pageName, ...(exceptId !== undefined && { id: Not(exceptId) }) },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(
        exceptId === undefined
          ? `SEO for the "${pageName}" page already exists (id ${existing.id}). Edit it instead of creating a new one.`
          : `SEO for the "${pageName}" page already exists (id ${existing.id}).`,
      );
    }
  }

  private async hasActiveRow(userId: number, pageName: SeoPageName, exceptId?: number) {
    return await this.seoRepository.exists({
      where: {
        user: { id: userId },
        pageName,
        isActive: true,
        ...(exceptId !== undefined && { id: Not(exceptId) }),
      },
    });
  }

  async remove(id: number, userId: number) {
    const seo = await this.findOne(id, userId);
    await this.seoRepository.remove(seo);
  }
}
