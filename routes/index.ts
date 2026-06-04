import { Hono } from "hono";
import { startBrowserWithSessionHandler } from "@/handlers/auth";
import type { Env } from "@/index";

const auth = new Hono<Env>().basePath("/api/v1/auth");
auth.get("/start-browser-with-session", startBrowserWithSessionHandler);

function registerRoutes(app: Hono<Env>) {
  app.route("/", auth);
}

export default registerRoutes;