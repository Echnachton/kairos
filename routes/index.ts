import { startBrowserWithSessionHandler } from "@/handlers/auth";
import {
  deletePresetFiltersHandler,
  getPresetFiltersTableHeader,
  getPresetFiltersTableRows,
  postPresetFiltersHandler,
} from "@/handlers/preset-filters";
import { getWebUiLayout } from "@/handlers/web-ui";
import type { Env } from "@/index";
import { Hono } from "hono";

const webUi = new Hono<Env>().basePath("");
webUi.get("", getWebUiLayout);
webUi.get("/preset-filters-table-row", getPresetFiltersTableRows);
webUi.get("/preset-filters-table-header", getPresetFiltersTableHeader);

const auth = new Hono<Env>().basePath("/api/v1/auth");
auth.get("/start-browser-with-session", startBrowserWithSessionHandler);

const presetFilters = new Hono<Env>().basePath("/api/v1/preset_filters");
presetFilters.post("", postPresetFiltersHandler);
presetFilters.delete("", deletePresetFiltersHandler);

function registerRoutes(app: Hono<Env>) {
  app.route("/", auth);
  app.route("/", presetFilters);
  app.route("/", webUi);
}

export default registerRoutes;
