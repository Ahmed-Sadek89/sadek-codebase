import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Seo } from './entities/seo.entity';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { FilterSeoDto } from './dto/filter-seo.dto';
import { paginate } from '../common/pagination';
import { PagesService } from '../pages/pages.service';

const seoRelations = { user: true, page: true } as const;
const seoSelect = {
  user: { id: true },
  page: { id: true, name_en: true, name_ar: true },
} as const;

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(Seo)
    private readonly seoRepository: Repository<Seo>,
    private readonly pagesService: PagesService,
  ) { }

  async create(createSeoDto: CreateSeoDto, userId: number) {
    // The page must be the user's own (404 otherwise) and still without SEO.
    const page = await this.pagesService.findOne(createSeoDto.pageId, userId);
    await this.assertPageFree(page.id, page.name_en);
    // A page has one SEO row, so it goes live right away.
    const seo = this.seoRepository.create({
      ...createSeoDto,
      isActive: true,
      user: { id: userId },
    });
    return await this.seoRepository.save(seo);
  }

  async findAll(query: FilterSeoDto, userId: number) {
    const filters: FindOptionsWhere<Seo> = { user: { id: userId } };
    if (query.isActive !== undefined) {
      filters.isActive = query.isActive;
    }
    if (query.pageId !== undefined) {
      filters.pageId = query.pageId;
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
      relations: seoRelations,
      select: seoSelect,
      order: query.order,
    });
  }

  /** Public: the active SEO of a page owned by the user whose `isDefaultView` is true. */
  async findPublic(pageId: number): Promise<Seo> {
    const seo = await this.seoRepository.findOne({
      where: { pageId, isActive: true, user: { isDefaultView: true } },
      relations: { page: true },
      select: { page: { id: true, name_en: true, name_ar: true } },
    });
    if (!seo) {
      throw new NotFoundException(`No active SEO found for page ${pageId}`);
    }
    return seo;
  }

  async findOne(id: number, userId: number) {
    const seo = await this.seoRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { page: true },
      select: { page: { id: true, name_en: true, name_ar: true } },
    });
    if (!seo) {
      throw new NotFoundException(`Seo with id ${id} not found`);
    }
    return seo;
  }

  async update(id: number, updateSeoDto: UpdateSeoDto, userId: number) {
    const seo = await this.findOne(id, userId);
    if (updateSeoDto.pageId !== undefined && updateSeoDto.pageId !== seo.pageId) {
      const page = await this.pagesService.findOne(updateSeoDto.pageId, userId);
      await this.assertPageFree(page.id, page.name_en, id);
    }
    Object.assign(seo, updateSeoDto);
    // Keep the loaded relation in step with the new pageId before saving.
    if (updateSeoDto.pageId !== undefined) {
      seo.page = { id: updateSeoDto.pageId } as Seo['page'];
    }
    return await this.seoRepository.save(seo);
  }

  /** Toggles `isActive`: a live row goes offline, an offline row goes live. */
  async toggleActive(id: number, userId: number) {
    const seo = await this.findOne(id, userId);
    const isActive = !seo.isActive;
    await this.seoRepository.update({ id: seo.id }, { isActive });
    seo.isActive = isActive;
    return seo;
  }

  /**
   * `pageId` is unique (seo 1:1 pages), so a page that already has SEO is a
   * 409 with a clear message instead of the database's 500.
   */
  private async assertPageFree(pageId: number, pageName: string, exceptId?: number) {
    const existing = await this.seoRepository.findOne({
      where: { pageId, ...(exceptId !== undefined && { id: Not(exceptId) }) },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(
        exceptId === undefined
          ? `The page "${pageName}" already has SEO (id ${existing.id}). Edit it instead of creating a new one.`
          : `The page "${pageName}" already has SEO (id ${existing.id}).`,
      );
    }
  }

  async remove(id: number, userId: number) {
    const seo = await this.findOne(id, userId);
    await this.seoRepository.remove(seo);
  }
}
