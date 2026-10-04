import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DataSourceOptions } from "typeorm";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

export const dbConnection: DataSourceOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? "",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true" || Boolean(process.env.DATABASE_URL)
        ? { rejectUnauthorized: false }
        : false,
}

export const dbConnectionOptions: DataSourceOptions = {
    ...dbConnection,
    logging: (process.env.TYPEORM_LOGGING ?? "true") === "true",
    synchronize: process.env.TYPEORM_SYNC === "true",
}

export const dbConfig: TypeOrmModuleOptions = {
    ...dbConnectionOptions,
    autoLoadEntities: true,
};
