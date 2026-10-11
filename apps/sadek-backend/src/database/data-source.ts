import { dbConnectionOptions } from "../../lib/DBConfig";
import { User } from "../user/entities/user.entity";
import { CategorySkill } from "../category_skills/entities/category_skill.entity";
import { Skill } from "../skills/entities/skill.entity";
import { CategoryProject } from "../category-projects/entities/category-project.entity";
import { Project } from "../projects/entities/project.entity";
import "reflect-metadata";
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import userFactory from './factories/user.factory';
import MainSeeder from './seeds/main-seeder';
import CategorySkillsSeeder from './seeds/category-skills.seeder';

const options: SeederOptions & DataSourceOptions = {
    ...dbConnectionOptions,
    // Every entity reachable through relations must be registered, or TypeORM
    // cannot build metadata for User (which relates to all of them).
    entities: [User, CategorySkill, Skill, CategoryProject, Project],
    factories: [userFactory],
    // Order matters: users first, then the categories that belong to them.
    seeds: [MainSeeder, CategorySkillsSeeder],
}

export const AppDataSource = new DataSource(options);
