import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { hasRows, SEED_COUNT } from './seed.utils';

/** Seeds SEED_COUNT users (password `Password@123`) into an empty `users` table. */
export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (await hasRows(dataSource, User, 'users')) return;

    const users = await factoryManager.get(User).saveMany(SEED_COUNT);
    console.log(`Seeded ${users.length} users`);
  }
}
