import { runSeeder, runSeeders } from "typeorm-extension";
import { AppDataSource } from "./data-source";
import MainSeeder from "./seeds/main-seeder";
import CategorySkillsSeeder from "./seeds/category-skills.seeder";
import CategoryProjectsSeeder from "./seeds/category-projects.seeder";
import SkillsSeeder from "./seeds/skills.seeder";
import ProjectsSeeder from "./seeds/projects.seeder";
import UserInfoSeeder from "./seeds/user-info.seeder";
import UserCompanySeeder from "./seeds/user-company.seeder";
import WhatCanDoSeeder from "./seeds/what-can-do.seeder";
import PagesSeeder from "./seeds/pages.seeder";
import SeoSeeder from "./seeds/seo.seeder";
import InstructorExperienceSeeder from "./seeds/instructor-experience.seeder";

// `pnpm seed` runs every seeder; `pnpm seed <name>` runs only that one.
// Each seeder skips its table when it already has rows.
const SEEDERS_BY_NAME = {
    users: MainSeeder,
    "category-skills": CategorySkillsSeeder,
    "category-projects": CategoryProjectsSeeder,
    skills: SkillsSeeder,
    projects: ProjectsSeeder,
    "user-info": UserInfoSeeder,
    "user-company": UserCompanySeeder,
    "what-can-do": WhatCanDoSeeder,
    pages: PagesSeeder,
    "seo": SeoSeeder,
    "instructor-experience": InstructorExperienceSeeder,
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
