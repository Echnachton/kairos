import { startBrowserWithSessionHandler } from "@/handlers/auth";
import {
  getPresetFiltersHandler,
  postPresetFiltersHandler,
} from "@/handlers/preset-filters";
import type { Env } from "@/index";
import { Hono } from "hono";

const auth = new Hono<Env>().basePath("/api/v1/auth");
auth.get("/start-browser-with-session", startBrowserWithSessionHandler);

const presetFilters = new Hono<Env>().basePath("/api/v1/preset_filters");
presetFilters.post("/", postPresetFiltersHandler);
presetFilters.get("/", getPresetFiltersHandler);

function registerRoutes(app: Hono<Env>) {
  app.route("/", auth);
  app.route("/", presetFilters);
}

export default registerRoutes;
