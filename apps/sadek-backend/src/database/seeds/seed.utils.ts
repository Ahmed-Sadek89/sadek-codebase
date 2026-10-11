import { faker, fakerAR } from '@faker-js/faker';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { User } from '../../user/entities/user.entity';

/** Rows each seeder inserts into an empty table. */
export const SEED_COUNT = 100;

/**
 * True when the table already has rows; the seeder then skips it, so
 * re-running `pnpm seed` never duplicates or overwrites data.
 */
export async function hasRows<T extends ObjectLiteral>(
  dataSource: DataSource,
  entity: EntityTarget<T>,
  label: string,
): Promise<boolean> {
  const existing = await dataSource.getRepository(entity).count();
  if (existing > 0) console.log(`Skip ${label} seed — ${existing} row(s) already exist`);
  return existing > 0;
}

/** Every seeded category, skill and project belongs to this user. */
export const SEED_OWNER_ID = 1;

/**
 * The user that owns seeded rows (id SEED_OWNER_ID), so a single dashboard
 * account sees every seeded row (lists, pagination, search).
 */
export async function getSeedOwner(
  dataSource: DataSource,
  label: string,
): Promise<User | null> {
  const owner = await dataSource
    .getRepository(User)
    .findOne({ where: { id: SEED_OWNER_ID }, select: { id: true } });
  if (!owner) {
    console.log(
      `Skip ${label} seed — user ${SEED_OWNER_ID} does not exist; run \`pnpm seed:users\` first`,
    );
  }
  return owner;
}

/** Cuts text to a column's varchar length. */
export function fit(value: string, max: number): string {
  return value.slice(0, max).trim();
}

/** "web tools" -> "Web Tools". */
export function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Mostly active rows, with some inactive ones for the status filter. */
export function randomIsActive(): boolean {
  return faker.datatype.boolean({ probability: 0.75 });
}

/** A creation date in the last two years, so date sorting has a spread. */
export function randomCreatedAt(): Date {
  return faker.date.past({ years: 2 });
}

/** Short Arabic text, e.g. for descriptions. */
export function arabicSentence(): string {
  return fakerAR.lorem.sentence();
}

export { faker, fakerAR };
