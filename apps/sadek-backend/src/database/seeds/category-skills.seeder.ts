import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CategorySkill } from '../../category_skills/entities/category_skill.entity';
import { CATEGORY_SKILLS_SEED } from './data/category-skills.data';
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

/**
 * Seeds SEED_COUNT skill categories for the seed owner into an empty table:
 * the curated list first, then generated ones.
 */
export default class CategorySkillsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    if (await hasRows(dataSource, CategorySkill, 'category skills')) return;
    const owner = await getSeedOwner(dataSource, 'category skills');
    if (!owner) return;

    const repo = dataSource.getRepository(CategorySkill);
    const categories = Array.from({ length: SEED_COUNT }, (_, index) =>
      repo.create({
        ...(CATEGORY_SKILLS_SEED[index] ?? {
          nameEn: fit(titleCase(`${faker.hacker.adjective()} ${faker.hacker.noun()}`), 50),
          nameAr: fit(fakerAR.commerce.department(), 50),
          descriptionEn: faker.hacker.phrase(),
          descriptionAr: arabicSentence(),
          isActive: randomIsActive(),
        }),
        createdAt: randomCreatedAt(),
        user: { id: owner.id },
      }),
    );
    await repo.save(categories);
    console.log(`Seeded ${categories.length} category skills for user ${owner.id}`);
  }
}
