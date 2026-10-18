---
name: nest-module
description: Scaffold a bare Nest module in apps/sadek-backend from a module name and a list of entity columns, creating only the entity, an empty service (repository injected), an empty controller and the module file, and registering it in app.module.ts and the seed data source. No DTOs, endpoints, business logic, factory or seeder. Use when the user asks to create, scaffold or generate a new backend module, entity or table with given columns.
argument-hint: <module-name> <columns, e.g. "title varchar(100) required, views int, isActive boolean">
---

# Bare Nest module + entity

Create a new backend module for: `$ARGUMENTS`.

Produce **only** the entity and the empty module skeleton. Do not add DTOs, CRUD methods, routes, guards on routes, validation, factories, seeders, tests or frontend code, even if it seems helpful. The user adds those later.

All paths below are under `apps/sadek-backend`.

## 1. Resolve names

From the module name, derive (example `user-info`):

| Name | Rule | Example |
| --- | --- | --- |
| Folder / file prefix | kebab-case | `src/user-info/`, `user-info.service.ts` |
| Route (`@Controller`) | kebab-case | `'user-info'` |
| Table (`@Entity`) | snake_case | `'user_info'` |
| Entity class | PascalCase, singular | `UserInfo` |
| Service / controller / module classes | PascalCase + suffix | `UserInfoService`, `UserInfoController`, `UserInfoModule` |
| Repository property | camelCase + `Repository` | `userInfoRepository` |
| Swagger tag | Title Case words | `'User Info'` |

If `src/<folder>` already exists, stop and ask the user before touching it.

## 2. Parse the columns

Column names are camelCase in code, matching the existing entities (`headTitle`, `yearsOfExp`). Convert snake_case input to camelCase, and fix obvious typos in names (tell the user).

Always add `id` as `@PrimaryGeneratedColumn()`, even if not listed. If the user lists `id`, do not add it twice.

Map types (pick the closest when the user writes something informal):

| User says | Decorator |
| --- | --- |
| string, varchar(n), text short | `@Column({ type: 'varchar', length: n, nullable })` (default `length: 255`) |
| text, long text, description | `@Column({ type: 'text', nullable })` |
| int, number, count | `@Column({ type: 'int', nullable })` |
| decimal(p,s), price | `@Column({ type: 'decimal', precision: p, scale: s, nullable })` |
| boolean, bool, isX | `@Column({ type: 'boolean', nullable })` |
| date, timestamp, datetime | `@Column({ type: 'timestamp', nullable })` |
| createdAt | `@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })` |
| json, object, array | `@Column({ type: 'jsonb', nullable })` |
| url, email, link | `varchar(255)` |

Nullability: `required` / `not null` means `nullable: false`; `optional` / `not required` means `nullable: true`. If the user says nothing, use `nullable: true`. Add `unique: true` only when asked. Add `default` only when given.

Relations (only when the user asks, for example `one-to-one User`, `many-to-one User`, `one-to-many Project`):

- `one-to-one X`: this entity owns it: `@OneToOne(() => X, (x) => x.<camelName>, { nullable: false, onDelete: 'CASCADE' })` + `@JoinColumn()`. Add the inverse `@OneToOne(() => <Entity>, (e) => e.x) <camelName>!: <Entity>;` at the end of X's entity.
- `many-to-one X`: `@ManyToOne(() => X, (x) => x.<camelPlural>, { nullable: false, onDelete: 'CASCADE' })`. Add the inverse `@OneToMany` array on X.
- `one-to-many X` / `many-to-many X`: confirm which side owns it with the user if unclear.

Relations to `User` are the common case: `User` lives in `src/user/entities/user.entity.ts` and every owned table cascades on user delete.

If a column's type or nullability is genuinely ambiguous (for example "companies" could be a count or a list), ask once, listing every ambiguous column together, before writing files.

## 3. Write the files

Match the existing code exactly: single quotes, `!:` definite assignment, 4-space indent in entities, 2-space indent elsewhere, `{ }` spacing in empty constructors. Reference module: `src/user-info/`.

`src/<folder>/entities/<folder>.entity.ts` (import only the typeorm decorators actually used):

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('<table>')
export class <Entity> {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    title!: string;
}
```

`src/<folder>/<folder>.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { <Entity> } from './entities/<folder>.entity';

@Injectable()
export class <Entity>Service {
  constructor(
    @InjectRepository(<Entity>)
    private readonly <repo>: Repository<<Entity>>
  ) { }
}
```

`src/<folder>/<folder>.controller.ts`:

```ts
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { <Entity>Service } from './<folder>.service';

@ApiTags('<Tag>')
@Controller('<route>')
export class <Entity>Controller {
  constructor(private readonly <service>: <Entity>Service) { }
}
```

`src/<folder>/<folder>.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { <Entity>Service } from './<folder>.service';
import { <Entity>Controller } from './<folder>.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <Entity> } from './entities/<folder>.entity';

@Module({
  imports: [TypeOrmModule.forFeature([<Entity>])],
  controllers: [<Entity>Controller],
  providers: [<Entity>Service],
  exports: [<Entity>Service],
})
export class <Entity>Module { }
```

## 4. Register it

- `src/app.module.ts`: import `<Entity>Module` after the last module import and append it to the end of `imports`.
- `src/database/data-source.ts`: import the entity and append it to the `entities` array. The seed data source needs every entity reachable through relations.

Do not touch `seed.ts`, factories, seeders, `package.json` or `.env`.

## 5. Verify

Run from `apps/sadek-backend`:

```bash
npm run -s check-types
```

Fix any error you introduced. Do not run the app, seeds, or anything that writes to the database.

## 6. Report

Reply with:

1. The files created and the two files edited.
2. A table of the entity's columns (name, type, required/optional, notes), including any names or types you changed or assumed.
3. The SQL to create the table. `TYPEORM_SYNC=false` in `.env`, so the table does not exist until this runs. Quote camelCase column names, and include FKs with `ON DELETE CASCADE` for relations:

   ```sql
   CREATE TABLE <table> (
     id SERIAL PRIMARY KEY,
     "headTitle" varchar(100) NOT NULL,
     "userId" int NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
   );
   ```

4. Ask whether to run the SQL on the database. Never run it without a yes.
