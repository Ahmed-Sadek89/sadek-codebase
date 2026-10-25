import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CategoryProject } from '../../category-projects/entities/category-project.entity';
import { Project } from '../../projects/entities/project.entity';
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

/**
 * Seeds SEED_COUNT projects for the seed owner into an empty table, each linked
 * to 1–3 random project categories of the owner. Run after category-projects.
 */
export default class ProjectsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    if (await hasRows(dataSource, Project, 'projects')) return;
    const owner = await getSeedOwner(dataSource, 'projects');
    if (!owner) return;

    const categories = await dataSource.getRepository(CategoryProject).find({
      where: { user: { id: owner.id } },
      select: { id: true },
    });
    if (categories.length === 0) {
      console.log(`Skip projects seed — no categories to link; run \`pnpm seed:category-projects\` first`);
      return;
    }
    const repo = dataSource.getRepository(Project);
    const projects = Array.from({ length: SEED_COUNT }, () => {
      const nameEn = fit(titleCase(faker.company.catchPhrase()), 100);
      return repo.create({
        nameEn,
        nameAr: fit(fakerAR.commerce.productName(), 100),
        shortDescriptionEn: fit(faker.company.catchPhrase(), 255),
        shortDescriptionAr: fit(fakerAR.lorem.sentence(), 255),
        descriptionEn: faker.lorem.paragraph(),
        descriptionAr: fakerAR.lorem.paragraph(),
        isActive: randomIsActive(),
        mainImageUrl: faker.image.url({ width: 1280, height: 720 }),
        liveUrl: faker.helpers.maybe(() => fit(faker.internet.url(), 255)),
        repoUrl: faker.helpers.maybe(
          () =>
            fit(
              `https://github.com/${faker.internet.userName()}/${faker.helpers.slugify(nameEn).toLowerCase()}`,
              255,
            ),
          { probability: 0.8 },
        ),
        createdAt: randomCreatedAt(),
        user: { id: owner.id },
        // 1–3 random ids from the owner's categories.
        categoryProjects: faker.helpers.arrayElements(categories, { min: 1, max: 3 }),
      });
    });
    await repo.save(projects);
    console.log(`Seeded ${projects.length} projects for user ${owner.id}`);
  }
}
