import env from "@/utils/resolve-env-vars";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: [
    "./database/preset-filters.ts",
  ],
  out: "./drizzle",
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
