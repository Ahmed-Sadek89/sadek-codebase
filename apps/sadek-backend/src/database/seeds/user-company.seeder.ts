import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserCompany } from '../../user-company/entities/user-company.entity';
import { getSeedOwner, hasRows, SEED_COUNT } from './seed.utils';

/** Seeds SEED_COUNT companies for the seed owner into an empty `user_company` table. */
export default class UserCompanySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (await hasRows(dataSource, UserCompany, 'user companies')) return;
    const owner = await getSeedOwner(dataSource, 'user companies');
    if (!owner) return;

    const factory = factoryManager.get(UserCompany);
    const companies = await Promise.all(
      Array.from({ length: SEED_COUNT }, () => factory.make({ user: owner })),
    );
    await dataSource.getRepository(UserCompany).save(companies);
    console.log(`Seeded ${companies.length} user companies for user ${owner.id}`);
  }
}
