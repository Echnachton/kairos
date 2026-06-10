import { presetFiltersTable } from "@/database/preset-filters";
import type { Env } from "@/index.ts";
import { and, count, like } from "drizzle-orm";
import { type Context } from "hono";
import { safeParse, z } from "zod";

type PostPresetFiltersBody = z.infer<typeof postPresetFiltersBody>;

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

export async function postPresetFiltersHandler(c: Context<Env>) {
  const db = c.get("db");
  const body = await c.req.json<PostPresetFiltersBody>();
  const parsedBody = safeParse(postPresetFiltersBody, body);

  if (!parsedBody.success) {
    return c.json({ message: "Bad request body" }, 400);
  }

  await db.insert(presetFiltersTable).values({
    displayName: body.display_name,
    createdAt: new Date(),
    filterString: body.filter_string,
  });

  return c.json({ message: "Success" }, 200);
}

export async function getPresetFiltersHandler(c: Context<Env>) {
  const db = c.get("db");
  const params = c.req.query();
  const parsedParams = safeParse(getPresetFiltersParams, params);

  if (!parsedParams.success) {
    return c.json({ message: "Bad query param" }, 400);
  }

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

  return c.json({
    preset_filters: rows,
    pagination_information: {
      total: totalCount ? totalCount[0]?.total : 0,
      count: rows.length,
    },
  }, 200);
}
