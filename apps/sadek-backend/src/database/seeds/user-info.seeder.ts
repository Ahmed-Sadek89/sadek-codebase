import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../user/entities/user.entity';
import { UserInfo } from '../../user-info/entities/user-info.entity';
import { hasRows } from './seed.utils';

/** Seeds one user-info row per existing user into an empty `user_info` table. */
export default class UserInfoSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (await hasRows(dataSource, UserInfo, 'user info')) return;

    const users = await dataSource.getRepository(User).find({ select: { id: true } });
    const factory = factoryManager.get(UserInfo);
    const rows = await Promise.all(users.map((user) => factory.make({ user })));
    await dataSource.getRepository(UserInfo).save(rows, { chunk: 100 });
    console.log(`Seeded ${rows.length} user info rows`);
  }
}
