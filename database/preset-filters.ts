import db from "@/database/client";
import { and, eq, like } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import crypto from "node:crypto";

export type PresetFilter = typeof presetFiltersTable.$inferSelect;
type GetPresetFiltersProps = {
  filterByDisplayName?: string | null;
  filterByFilterString?: string | null;
  limit?: number | null;
  offset?: number | null;
};
type DeletePresetFiltersProps = {
  id: string;
};

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

export async function insertPresetFilter(
  { displayName, filterString }: Pick<
    PresetFilter,
    "displayName" | "filterString"
  >,
) {
  await db.insert(presetFiltersTable).values({
    displayName,
    createdAt: new Date(),
    filterString,
  });
}

export async function getPresetFilters({
  filterByDisplayName,
  filterByFilterString,
  limit,
  offset,
}: GetPresetFiltersProps) {
  const conditions = [];

  if (filterByDisplayName) {
    conditions.push(
      like(presetFiltersTable.displayName, `%${filterByDisplayName}%`),
    );
  }

  if (filterByFilterString) {
    conditions.push(
      like(presetFiltersTable.filterString, `%${filterByFilterString}%`),
    );
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const dataQuery = db
    .select()
    .from(presetFiltersTable)
    .where(whereClause);

  const rows = limit != null && offset != null
    ? await dataQuery.limit(limit).offset(offset)
    : await dataQuery;

  return rows;
}

export async function deletePresetFilters({
  id,
}: DeletePresetFiltersProps) {
  await db
    .delete(presetFiltersTable)
    .where(eq(presetFiltersTable.id, id));
}

export async function getPresetFiltersCount() {
  return await db.$count(presetFiltersTable);
}
