import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { WhatCanDo } from '../../what-can-do/entities/what-can-do.entity';
import { getSeedOwner, hasRows, SEED_COUNT } from './seed.utils';

/** Seeds SEED_COUNT "what can do" items for the seed owner into an empty `what_can_do` table. */
export default class WhatCanDoSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    if (await hasRows(dataSource, WhatCanDo, 'what can do')) return;
    const owner = await getSeedOwner(dataSource, 'what can do');
    if (!owner) return;

    const factory = factoryManager.get(WhatCanDo);
    const items = await Promise.all(
      Array.from({ length: SEED_COUNT }, (_, index) => factory.make({ user: owner, rank: index + 1 })),
    );
    await dataSource.getRepository(WhatCanDo).save(items);
    console.log(`Seeded ${items.length} what can do items for user ${owner.id}`);
  }
}
