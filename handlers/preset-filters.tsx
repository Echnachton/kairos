import { presetFiltersTable } from "@/database/preset-filters";
import type { Env } from "@/index.ts";
import extractQueryParams from "@/utils/extract-query-params";
import extractRequestBody from "@/utils/extract-request-body";
import { and, count, eq, like } from "drizzle-orm";
import { type Context } from "hono";
import { z } from "zod";
import PresetFiltersTable from "@/views/PresetFiltersTable";

const postPresetFiltersBody = z.object({
  display_name: z.string(),
  filter_string: z.string(),
});

const getPresetFiltersParams = z.object({
  filter_by_display_name: z.string().nullish(),
  filter_by_filter_string: z.string().nullish(),
  limit: z.number().nullish(),
  offset: z.number().nullish(),
}).refine((data) => {
  return !!data.limit == !!data.offset;
}, {
  message: "Both limit and offset must be set.",
});

const deletePresetFiltersParams = z.object({
  id: z.string(),
});

export async function postPresetFiltersHandler(c: Context<Env>) {
  const db = c.get("db");
  const parsedBody = await extractRequestBody({
    schema: postPresetFiltersBody,
    c,
  });
  const { display_name: displayName, filter_string: filterString } =
    parsedBody.data;

  await db.insert(presetFiltersTable).values({
    displayName,
    createdAt: new Date(),
    filterString,
  });

  return c.json({ message: "Success" }, 200);
}

export async function getPresetFiltersHandler(c: Context<Env>) {
  const db = c.get("db");
  const parsedParams = extractQueryParams({
    schema: getPresetFiltersParams,
    c,
  });

  const {
    filter_by_display_name,
    filter_by_filter_string,
    limit,
    offset,
  } = parsedParams.data;

  const conditions = [];

  if (filter_by_display_name) {
    conditions.push(
      like(presetFiltersTable.displayName, `%${filter_by_display_name}%`),
    );
  }

  if (filter_by_filter_string) {
    conditions.push(
      like(presetFiltersTable.filterString, `%${filter_by_filter_string}%`),
    );
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const dataQuery = db
    .select()
    .from(presetFiltersTable)
    .where(whereClause);

  const countQuery = db
    .select({ total: count() })
    .from(presetFiltersTable)
    .where(whereClause);

  const [rows, totalCount] = await Promise.all([
    limit != null && offset != null
      ? dataQuery.limit(limit).offset(offset)
      : dataQuery,
    countQuery,
  ]);

  return c.html(<PresetFiltersTable rows={rows} />);
}

export async function deletePresetFiltersHandler(c: Context<Env>) {
  const db = c.get("db");
  const parsedBody = await extractRequestBody({
    schema: deletePresetFiltersParams,
    c,
  });
  const { id } = parsedBody.data;

  await db
    .delete(presetFiltersTable)
    .where(eq(presetFiltersTable.id, id));

  return c.json({ message: "Deleted row" }, 200);
}
