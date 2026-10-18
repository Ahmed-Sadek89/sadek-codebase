---
name: nest-crud
description: Fill an existing sadek-backend Nest module (usually one scaffolded by nest-module) with CRUD - DTOs, service methods, controller routes with the requested JwtAuthGuard guarding, Swagger decorators - plus its seed factory, seeder and seed registration. Use when the user gives a backend module name and asks for its HTTP requests, endpoints, CRUD, controller/service logic, guards or seed file.
argument-hint: <module-name> [guards, e.g. "all guarded" | "public: findAll, findOne"] [extras, e.g. "me endpoint", "search by name", "filter isActive"]
---

# CRUD + seed for an existing Nest module

Build the HTTP layer and seed for: `$ARGUMENTS`.

All paths are under `apps/sadek-backend`. The entity is the source of truth: never add, rename or retype columns in this skill. If the entity looks wrong, tell the user and stop.

## 1. Read before writing

1. Find the module: `ls src`. Folder names can differ from the route (`category_skills` vs `category-skills`). If nothing matches, list the modules and ask.
2. Read every file in the module: entity, service, controller, module, any existing `dto/`.
3. Read the related entities the entity points to (usually `src/user/entities/user.entity.ts`).
4. Read the reference modules for style:
   - `src/skills/` (owner-scoped CRUD with `ParseIntPipe`, the preferred pattern),
   - `src/user-info/` (one-to-one with `User`, `GET me`, conflict on second create),
   - `src/category-projects/dto/filter-category_projects.dto.ts` (search + boolean filter),
   - `src/common/pagination.ts`, `src/common/dto/pagination-query.dto.ts`, `src/common/transformers/to-boolean.ts`,
   - `src/database/factories/user-info.factory.ts`, `src/database/seeds/*.seeder.ts`, `src/database/seeds/seed.utils.ts`.

If the service or controller already has methods, keep them and only add what is missing. Ask before replacing existing logic.

## 2. Decide the shape

Work out from the entity:

- **Ownership.** `@ManyToOne(() => User)` means each row belongs to a user: scope every guarded query by `user: { id: userId }`, using `req.user.userId`. `@OneToOne(() => User)` additionally means at most one row per user. No relation to `User` means no scoping.
- **Guards.** Use what the user said. "all guarded" or nothing said: every route gets `@UseGuards(JwtAuthGuard)` (and say so in the report). "public: findAll, findOne" leaves those two unguarded. A public route has no `req.user`, so it is not owner-scoped; if it should only show some rows (for example `isActive: true`), ask once.
- **Extras.** Only add search fields, filters or extra routes the user asked for. Exception: a `@OneToOne(() => User)` entity always gets `GET me`, as in `user-info`.

## 3. Routes

Default set (method name is the Apidog / Swagger summary, so keep these names):

| Method | Route | Handler | Service |
| --- | --- | --- | --- |
| POST | `/` | `create` | `create(dto, userId)` |
| GET | `/` | `findAll` | `findAll(query, userId)`, paginated |
| GET | `/me` | `findMine` | `findByUser(userId)` (one-to-one only) |
| GET | `/:id` | `findOne` | `findOne(id, userId)` |
| PATCH | `/:id` | `update` | `update(id, dto, userId)` |
| DELETE | `/:id` | `remove` | `remove(id, userId)` |

Declare `me` (and any other literal path) **before** `:id`. Drop `userId` parameters for unowned entities and for public routes.

Every guarded handler gets exactly these two decorators, in this order, directly above the HTTP decorator:

```ts
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: RequestUserDto) {
    return await this.<service>.findOne(id, req.user.userId);
  }
```

Imports: `JwtAuthGuard` from `../auth/guard/jwt-auth/jwt-auth.guard`, `RequestUserDto` from `../auth/dto/request-user.dto`, `ApiBearerAuth, ApiTags` from `@nestjs/swagger`. Keep the existing `@ApiTags` and `@Controller` lines.

`update` and `remove` controllers return `{ message: '<Entity words> updated successfully' }` / `'... deleted successfully'`, like `category-projects`.

## 4. DTOs (`src/<folder>/dto/`)

- `create-<folder>.dto.ts`: one property per writable entity column. Skip `id`, `createdAt`/`@CreateDateColumn`, and relation objects (the owner comes from the token). For a relation the client must choose (for example a category), accept `<name>Id: number` or `<name>Ids: number[]` and resolve it in the service with an ownership check.
- Map nullability: `nullable: false` means required (`!:`, no `@IsOptional`); `nullable: true` means `?:` with `@IsOptional()`.
- Map validators from the column: varchar(n) `@IsString() @MaxLength(n)` (+ `@IsNotEmpty()` when required); text `@IsString()`; int `@IsInt()` (+ `@Min(0)` for counts); decimal `@IsNumber()`; boolean `@IsBoolean()`; timestamp/date `@Type(() => Date) @IsDate()`; email-like names `@IsEmail()`; url-like names (`*Url`, `logo`, `avatar`, `linkedin`, `github`, `cv`) `@IsUrl(URL_OPTIONS)` with the `URL_OPTIONS` constant from `user-info`'s DTO.
- `update-<folder>.dto.ts`: `export class Update<Entity>Dto extends PartialType(Create<Entity>Dto) {}` with `PartialType` from **`@nestjs/swagger`** (not `@nestjs/mapped-types`, which drops the OpenAPI schema).
- `filter-<folder>.dto.ts`: only when the user asked for search or filters. Otherwise `findAll` takes `PaginationQueryDto` directly. Follow `filter-category_projects.dto.ts` (`search` with `MaxLength(20)`, booleans via `@ToBoolean() @IsBoolean()`).

The global `ValidationPipe` has `whitelist`, `forbidNonWhitelisted` and implicit conversion on, so do not add per-route pipes beyond `ParseIntPipe`.

## 5. Service

Inject the repository (already there from `nest-module`). Implement, following `src/skills/skills.service.ts`:

- `create`: for one-to-one, `exists({ where: { user: { id: userId } } })` then `ConflictException('<Entity> already exists for this user')`. `repository.create({ ...dto, user: { id: userId } })`, then `save`.
- `findAll`: `paginate({ repository, where, page, limit, order, relations: { user: true }, select: { user: { id: true } } })` with `where = { user: { id: userId } }` plus any requested filters. Search over several columns uses an array of `where` objects with `ILike(\`%${search}%\`)`, trimmed first.
- `findOne`: `findOne({ where: { id, user: { id: userId } } })`, `NotFoundException(\`<Entity> with id ${id} not found\`)` when missing. A row owned by another user is "not found", never "forbidden".
- `findByUser` (one-to-one): same, by `user: { id: userId }`.
- `update`: `findOne(id, userId)` first (ownership), then `Object.assign(entity, dto)` and `save`.
- `remove`: `findOne(id, userId)`, then `repository.remove(entity)`.

Return types follow the reference modules. Do not wrap repository errors in try/catch.

## 6. Seed

- `src/database/factories/<folder>.factory.ts`: `setSeederFactory(<Entity>, () => { ... })` filling every non-relation column with realistic `faker` values, sliced to each varchar `length`. Dates: `faker.date.past(...)`, and make "to" dates come after "from" dates (or `undefined` for open-ended ones). URLs: `faker.image.url()` for images, `faker.internet.url()` otherwise.
- `src/database/seeds/<folder>.seeder.ts`, first line of `run()`: `if (await hasRows(dataSource, <Entity>, '<label>')) return;` so a table with even one row is never seeded again.
  - many-to-one `User`: get the owner with `getSeedOwner(dataSource, '<label>')`, return if null, then `make` `SEED_COUNT` rows with `{ user: owner }` and `save`.
  - one-to-one `User`: one row per existing user, as in `user-info.seeder.ts`.
  - no user relation: `factoryManager.get(<Entity>).saveMany(SEED_COUNT)`.
- Register it:
  - `src/database/data-source.ts`: import the factory into `factories` and the seeder at the end of `seeds` (after anything it depends on). Make sure the entity is in `entities`.
  - `src/database/seed.ts`: import the seeder and add `"<folder>": <Entity>Seeder` to `SEEDERS_BY_NAME`.
  - `package.json`: add `"seed:<folder>": "ts-node -r tsconfig-paths/register ./src/database/seed.ts <folder>"` after the last `seed:` script.

## 7. Verify

From `apps/sadek-backend`:

```bash
npm run -s check-types
```

Fix every error you introduced. If the dev server is running on port 4000, check the new routes appear in `http://localhost:4000/openapi.json` with `curl` (read-only). Do not run seeds, migrations or SQL, and do not call write endpoints.

## 8. Report

Reply with:

1. A route table: method, path, guarded or public, owner-scoped or not, body / query DTO, response.
2. The DTO rules per field (required or optional, validators), including any you inferred.
3. The files created and edited.
4. The seed command (`pnpm seed:<folder>`), what it inserts, and that it skips a non-empty table.
5. If `information_schema` was not checked in this session, remind the user that `TYPEORM_SYNC=false`, so the table must exist before the routes or seed work.
6. Any choices left to the user (for example which routes should be public).
