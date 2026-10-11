import { runSeeder, runSeeders } from "typeorm-extension";
import { AppDataSource } from "./data-source";
import CategorySkillsSeeder from "./seeds/category-skills.seeder";

// `pnpm seed` runs every seeder; `pnpm seed <name>` runs only that one.
const SEEDERS_BY_NAME = {
    "category-skills": CategorySkillsSeeder,
} as const;

type SeederName = keyof typeof SEEDERS_BY_NAME;

function isSeederName(name: string): name is SeederName {
    return Object.hasOwn(SEEDERS_BY_NAME, name);
}

async function main() {
    const name = process.argv[2];
    if (name !== undefined && !isSeederName(name)) {
        throw new Error(
            `Unknown seeder "${name}". Available: ${Object.keys(SEEDERS_BY_NAME).join(", ")}`,
        );
    }

    await AppDataSource.initialize();
    try {
        if (name) {
            await runSeeder(AppDataSource, SEEDERS_BY_NAME[name]);
        } else {
            await runSeeders(AppDataSource);
        }
        console.log('Database seeding completed');
    } finally {
        await AppDataSource.destroy();
    }
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
