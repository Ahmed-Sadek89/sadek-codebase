import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Seo } from '../../seo/entities/seo.entity';
import { Page } from '../../pages/entities/page.entity';
import { hasRows } from './seed.utils';

/** Seeds one live SEO row per page (seo 1:1 pages) into an empty `seo` table; run after the pages seed. */
export default class SeoSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (await hasRows(dataSource, Seo, 'seo')) return;
    const pages = await dataSource
      .getRepository(Page)
      .find({ relations: { user: true }, select: { id: true, user: { id: true } } });
    if (!pages.length) {
      console.log('Skip seo seed — no pages exist; run `pnpm seed:pages` first');
      return;
    }

    const factory = factoryManager.get(Seo);
    const items = await Promise.all(
      pages.map((page) =>
        factory.make({ page, pageId: page.id, user: page.user, isActive: true }),
      ),
    );
    await dataSource.getRepository(Seo).save(items);
    console.log(`Seeded ${items.length} seo rows`);
  }
}
