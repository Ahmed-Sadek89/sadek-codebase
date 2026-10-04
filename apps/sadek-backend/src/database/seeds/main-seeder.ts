import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userFactory = factoryManager.get(User);
    const userRepo = dataSource.getRepository(User);
    const existing = await userRepo.count();
    if (existing > 0) {
      console.log(`Skip seed — ${existing} user(s) already exist`);
      return;
    }

    const users = await userFactory.saveMany(50);


    console.log(
      `Seeded ${users.length} users`,
    );
  }
}