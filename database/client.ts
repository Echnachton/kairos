import env from "@/utils/resolve-env-vars";
import { drizzle } from "drizzle-orm/bun-sqlite";

const db = drizzle(env.DB_FILE_NAME);

export default db;
