import { presetFiltersTable } from "@/database/preset-filters";
import type { Env } from "@/index.ts";
import appendLayout from "@/utils/append-layout";
import extractQueryParams from "@/utils/extract-query-params";
import extractRequestBody from "@/utils/extract-request-body";
import PresetFiltersTableHeader from "@/views/PresetFiltersTableHeader";
import PresetFiltersTableRows from "@/views/PresetFiltersTableRows";
import { and, eq, like } from "drizzle-orm";
import { type Context } from "hono";
import { z } from "zod";

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

export async function getPresetFiltersTableRows(c: Context<Env>) {
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

  const rows = limit != null && offset != null
    ? await dataQuery.limit(limit).offset(offset)
    : await dataQuery;

  return appendLayout(
    c,
    <PresetFiltersTableRows rows={rows} />,
  );
}

export async function getPresetFiltersTableHeader(c: Context<Env>) {
  const db = c.get("db");

  const total = await db.$count(presetFiltersTable);

  return appendLayout(
    c,
    <PresetFiltersTableHeader total={total} />,
  );
}

export async function deletePresetFiltersHandler(c: Context<Env>) {
  const db = c.get("db");
  const parsedParams = extractQueryParams({
    schema: deletePresetFiltersParams,
    c,
  });
  const { id } = parsedParams.data;

  await db
    .delete(presetFiltersTable)
    .where(eq(presetFiltersTable.id, id));

  return c.json({ message: "Deleted row" }, 200);
}
