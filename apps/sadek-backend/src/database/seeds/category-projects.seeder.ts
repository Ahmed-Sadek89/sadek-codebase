import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CategoryProject } from '../../category-projects/entities/category-project.entity';
import {
  faker,
  fakerAR,
  fit,
  getSeedOwner,
  hasRows,
  randomCreatedAt,
  randomIsActive,
  SEED_COUNT,
  titleCase,
} from './seed.utils';

/** Seeds SEED_COUNT project categories for the seed owner into an empty table. */
export default class CategoryProjectsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    if (await hasRows(dataSource, CategoryProject, 'category projects')) return;
    const owner = await getSeedOwner(dataSource, 'category projects');
    if (!owner) return;

    const repo = dataSource.getRepository(CategoryProject);
    const categories = Array.from({ length: SEED_COUNT }, (_, index) =>
      repo.create({
        nameEn: fit(titleCase(`${faker.commerce.department()} ${faker.word.noun()}`), 50),
        nameAr: fit(fakerAR.commerce.department(), 50),
        // 1..n, the order the website shows them in.
        rank: index + 1,
        isActive: randomIsActive(),
        createdAt: randomCreatedAt(),
        user: { id: owner.id },
      }),
    );
    await repo.save(categories);
    console.log(`Seeded ${categories.length} category projects for user ${owner.id}`);
  }
}
