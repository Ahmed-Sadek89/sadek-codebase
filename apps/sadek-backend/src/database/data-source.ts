import { dbConnectionOptions } from "../../lib/DBConfig";
import { User } from "../user/entities/user.entity";
import { CategorySkill } from "../category_skills/entities/category_skill.entity";
import { Skill } from "../skills/entities/skill.entity";
import { CategoryProject } from "../category-projects/entities/category-project.entity";
import { Project } from "../projects/entities/project.entity";
import { UserInfo } from "../user-info/entities/user-info.entity";
import { UserCompany } from "../user-company/entities/user-company.entity";
import "reflect-metadata";
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import userFactory from './factories/user.factory';
import userInfoFactory from './factories/user-info.factory';
import userCompanyFactory from './factories/user-company.factory';
import MainSeeder from './seeds/main-seeder';
import CategorySkillsSeeder from './seeds/category-skills.seeder';
import SkillsSeeder from './seeds/skills.seeder';
import CategoryProjectsSeeder from './seeds/category-projects.seeder';
import ProjectsSeeder from './seeds/projects.seeder';
import UserInfoSeeder from './seeds/user-info.seeder';
import UserCompanySeeder from './seeds/user-company.seeder';

const options: SeederOptions & DataSourceOptions = {
    ...dbConnectionOptions,
    // Every entity reachable through relations must be registered, or TypeORM
    // cannot build metadata for User (which relates to all of them).
    entities: [User, CategorySkill, Skill, CategoryProject, Project, UserInfo, UserCompany],
    factories: [userFactory, userInfoFactory, userCompanyFactory],
    // Order matters: users own everything; both category tables come before
    // the skills and projects that link to random category ids.
    seeds: [
        MainSeeder,
        CategorySkillsSeeder,
        CategoryProjectsSeeder,
        SkillsSeeder,
        ProjectsSeeder,
        UserInfoSeeder,
        UserCompanySeeder,
    ],
}

export const AppDataSource = new DataSource(options);
