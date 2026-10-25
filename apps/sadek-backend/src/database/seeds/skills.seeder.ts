import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CategorySkill } from '../../category_skills/entities/category_skill.entity';
import { Skill } from '../../skills/entities/skill.entity';
import {
  faker,
  fit,
  getSeedOwner,
  hasRows,
  randomCreatedAt,
  randomIsActive,
  SEED_COUNT,
  titleCase,
} from './seed.utils';

/**
 * Seeds SEED_COUNT skills for the seed owner into an empty table, each linked
 * to 1–3 random skill categories of the owner. Run after category-skills.
 */
export default class SkillsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    if (await hasRows(dataSource, Skill, 'skills')) return;
    const owner = await getSeedOwner(dataSource, 'skills');
    if (!owner) return;

    const categories = await dataSource.getRepository(CategorySkill).find({
      where: { user: { id: owner.id } },
      select: { id: true },
    });
    if (categories.length === 0) {
      console.log(`Skip skills seed — no categories to link; run \`pnpm seed:category-skills\` first`);
      return;
    }
    const repo = dataSource.getRepository(Skill);
    const skills = Array.from({ length: SEED_COUNT }, () =>
      repo.create({
        name: fit(titleCase(`${faker.hacker.abbreviation()} ${faker.hacker.noun()}`), 50),
        isActive: randomIsActive(),
        createdAt: randomCreatedAt(),
        user: { id: owner.id },
        // 1–3 random ids from the owner's categories.
        categorySkills: faker.helpers.arrayElements(categories, { min: 1, max: 3 }),
      }),
    );
    await repo.save(skills);
    console.log(`Seeded ${skills.length} skills for user ${owner.id}`);
  }
}
