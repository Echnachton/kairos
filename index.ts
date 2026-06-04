import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "hono/bun";
import { join } from "node:path";
import registerRoutes from "./routes";
import type { Page } from "playwright";

export type Env = {
  Variables: {
    page: Page;
  }
}

const WEB_ROOT = join(import.meta.dirname, "web");

const app = new Hono<Env>();

app.use('*', serveStatic({
  root: WEB_ROOT
}));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error(err);
  return c.text("Internal Server Error", 500);
});

registerRoutes(app);

const LONG_RUNNING_ROUTES = new Set([
  "/api/v1/auth/start-browser-with-session",
]);

export default {
  fetch(req: Request, server: Bun.Server<unknown>) {
    const pathname = new URL(req.url).pathname;
    if (LONG_RUNNING_ROUTES.has(pathname)) {
      server.timeout(req, 60);
    }
    return app.fetch(req);
  },
};