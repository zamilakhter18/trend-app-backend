import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  schema: "public",
  entities: ["src/db/entities/*.entity.ts"],
  migrations: ["src/db/migrations/*.ts"],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});
