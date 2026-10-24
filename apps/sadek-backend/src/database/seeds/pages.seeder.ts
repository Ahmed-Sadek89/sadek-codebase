import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Page } from '../../pages/entities/page.entity';
import { User } from '../../user/entities/user.entity';
import { hasRows } from './seed.utils';

/**
 * The website's real pages. Fixed names instead of a faker factory: names are
 * unique and should match apps/web routes. Add one when the website gets a page.
 */
const SEED_PAGES = [{ name_en: 'Home', name_ar: 'الرئيسية' }];

/** Seeds the website pages for the default-view user into an empty `pages` table. */
export default class PagesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    if (await hasRows(dataSource, Page, 'pages')) return;
    const owner = await dataSource
      .getRepository(User)
      .findOne({ where: { isDefaultView: true }, select: { id: true } });
    if (!owner) {
      console.log('Skip pages seed — no default-view user exists');
      return;
    }

    const repository = dataSource.getRepository(Page);
    const pages = SEED_PAGES.map((page) => repository.create({ ...page, user: owner }));
    await repository.save(pages);
    console.log(`Seeded ${pages.length} pages for user ${owner.id}`);
  }
}
