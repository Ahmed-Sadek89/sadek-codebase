import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CategoryProject } from '../../category-projects/entities/category-project.entity';
import {
  arabicSentence,
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
    const categories = Array.from({ length: SEED_COUNT }, () =>
      repo.create({
        nameEn: fit(titleCase(`${faker.commerce.department()} ${faker.word.noun()}`), 50),
        nameAr: fit(fakerAR.commerce.department(), 50),
        descriptionEn: faker.company.catchPhrase(),
        descriptionAr: arabicSentence(),
        isActive: randomIsActive(),
        createdAt: randomCreatedAt(),
        user: { id: owner.id },
      }),
    );
    await repo.save(categories);
    console.log(`Seeded ${categories.length} category projects for user ${owner.id}`);
  }
}
