import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CategorySkill } from '../../category_skills/entities/category_skill.entity';
import { User } from '../../user/entities/user.entity';
import { CATEGORY_SKILLS_SEED } from './data/category-skills.data';

/**
 * Gives every user who has no skill categories the default set.
 * Users who already have categories are skipped, so re-running is safe.
 */
export default class CategorySkillsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const categoryRepo = dataSource.getRepository(CategorySkill);

    const users = await userRepo.find({ select: { id: true } });
    if (users.length === 0) {
      console.log('Skip category skills seed — no users exist; run `pnpm seed` first');
      return;
    }

    let seededUsers = 0;
    let seededCategories = 0;
    for (const user of users) {
      const existing = await categoryRepo.count({ where: { user: { id: user.id } } });
      if (existing > 0) continue;

      const categories = CATEGORY_SKILLS_SEED.map((seed) =>
        categoryRepo.create({ ...seed, user: { id: user.id } }),
      );
      await categoryRepo.save(categories);
      seededUsers += 1;
      seededCategories += categories.length;
    }

    console.log(
      `Seeded ${seededCategories} category skills for ${seededUsers} user(s); ` +
        `skipped ${users.length - seededUsers} user(s) that already had categories`,
    );
  }
}
