import { dbConnectionOptions } from "../../lib/DBConfig";
import { User } from "../user/entities/user.entity";
import "reflect-metadata";
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import userFactory from './factories/user.factory';
import MainSeeder from './seeds/main-seeder';

const options: SeederOptions & DataSourceOptions = {
    ...dbConnectionOptions,
    entities: [User],
    factories: [userFactory],
    seeds: [MainSeeder],
}

export const AppDataSource = new DataSource(options);
