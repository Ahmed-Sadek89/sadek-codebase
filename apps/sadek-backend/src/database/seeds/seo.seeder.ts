import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { SeoPageName } from '@repo/constants/seo-pages';
import { Seo } from '../../seo/entities/seo.entity';
import { User } from '../../user/entities/user.entity';
import { hasRows } from './seed.utils';

/** Rows seeded per page for the default-view user; only each page's first one is active. */
const SEO_SEED_COUNT_PER_PAGE = 5;

/** Seeds SEO rows for every page for the default-view user into an empty `seo` table. */
export default class SeoSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (await hasRows(dataSource, Seo, 'seo')) return;
    const owner = await dataSource
      .getRepository(User)
      .findOne({ where: { isDefaultView: true }, select: { id: true } });
    if (!owner) {
      console.log('Skip seo seed — no default-view user exists');
      return;
    }

    const factory = factoryManager.get(Seo);
    const items = await Promise.all(
      Object.values(SeoPageName).flatMap((pageName) =>
        Array.from({ length: SEO_SEED_COUNT_PER_PAGE }, (_, index) =>
          factory.make({ user: owner, pageName, isActive: index === 0 }),
        ),
      ),
    );
    await dataSource.getRepository(Seo).save(items);
    console.log(`Seeded ${items.length} seo rows for user ${owner.id}`);
  }
}
