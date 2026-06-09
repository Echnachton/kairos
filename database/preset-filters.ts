import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import crypto from "node:crypto";

export const presetFiltersTable = sqliteTable("preset_filters", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  displayName: text("name"),
  filterString: text("filter_string")
    .notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull(),
  lastModifiedAt: int("last_modified_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
