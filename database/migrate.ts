import env from "@/utils/resolve-env-vars";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database(env.DB_FILE_NAME);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "./drizzle" });

console.log("Migrations applied");
sqlite.close();
