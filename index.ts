import registerRoutes from "@/routes";
import env from "@/utils/resolve-env-vars";
import { type BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Page } from "playwright";

export type Env = {
  Variables: {
    page: Page;
    db: BunSQLiteDatabase;
  };
};

const LONG_RUNNING_ROUTES = new Set([
  "/api/v1/auth/start-browser-with-session",
]);

const db = drizzle(env.DB_FILE_NAME);

const app = new Hono<Env>();

app.use("*", async (c, next) => {
  c.set("db", db);
  await next();
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error(err);
  return c.text("Internal Server Error", 500);
});

registerRoutes(app);

export default {
  fetch(req: Request, server: Bun.Server<unknown>) {
    const pathname = new URL(req.url).pathname;
    if (LONG_RUNNING_ROUTES.has(pathname)) {
      server.timeout(req, 60);
    }
    return app.fetch(req);
  },
};
