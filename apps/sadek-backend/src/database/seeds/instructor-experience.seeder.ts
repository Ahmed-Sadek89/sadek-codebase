import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { InstructorExperience } from '../../instructor-experience/entities/instructor-experience.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { faker, getSeedOwner, hasRows, SEED_COUNT } from './seed.utils';

/**
 * Seeds SEED_COUNT instructor experiences for the seed owner into an empty
 * `instructor_experience` table, each linked to 1–3 random skills of the owner.
 * Run after skills.
 */
export default class InstructorExperienceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (await hasRows(dataSource, InstructorExperience, 'instructor experiences')) return;
    const owner = await getSeedOwner(dataSource, 'instructor experiences');
    if (!owner) return;

    const skills = await dataSource.getRepository(Skill).find({
      where: { user: { id: owner.id } },
      select: { id: true },
    });
    if (skills.length === 0) {
      console.log(`Skip instructor experiences seed — no skills to link; run \`pnpm seed:skills\` first`);
      return;
    }

    const factory = factoryManager.get(InstructorExperience);
    const rows = await Promise.all(
      Array.from({ length: SEED_COUNT }, () =>
        factory.make({
          user: owner,
          skills: faker.helpers.arrayElements(skills, { min: 1, max: 3 }),
        }),
      ),
    );
    await dataSource.getRepository(InstructorExperience).save(rows);
    console.log(`Seeded ${rows.length} instructor experiences for user ${owner.id}`);
  }
}
