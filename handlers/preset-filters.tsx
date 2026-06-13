import {
  deletePresetFilters,
  getPresetFilters,
  getPresetFiltersCount,
  insertPresetFilter,
} from "@/database/preset-filters";
import type { Env } from "@/index.ts";
import appendLayout from "@/utils/append-layout";
import extractQueryParams from "@/utils/extract-query-params";
import extractRequestBody from "@/utils/extract-request-body";
import PresetFiltersTableHeader from "@/views/PresetFiltersTableHeader";
import PresetFiltersTableRows from "@/views/PresetFiltersTableRows";
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
  const parsedBody = await extractRequestBody({
    schema: postPresetFiltersBody,
    c,
  });
  const { display_name: displayName, filter_string: filterString } =
    parsedBody.data;

  await insertPresetFilter({ displayName, filterString });

  return c.json({ message: "Success" }, 200);
}

export async function getPresetFiltersTableRows(c: Context<Env>) {
  const parsedParams = extractQueryParams({
    schema: getPresetFiltersParams,
    c,
  });

  const {
    filter_by_display_name: filterByDisplayName,
    filter_by_filter_string: filterByFilterString,
    limit,
    offset,
  } = parsedParams.data;

  const rows = await getPresetFilters({
    filterByDisplayName,
    filterByFilterString,
    limit,
    offset,
  });

  return appendLayout(
    c,
    <PresetFiltersTableRows rows={rows} />,
  );
}

export async function getPresetFiltersTableHeader(c: Context<Env>) {
  const total = await getPresetFiltersCount();

  return appendLayout(
    c,
    <PresetFiltersTableHeader total={total} />,
  );
}

export async function deletePresetFiltersHandler(c: Context<Env>) {
  const parsedParams = extractQueryParams({
    schema: deletePresetFiltersParams,
    c,
  });
  const { id } = parsedParams.data;

  await deletePresetFilters({ id });

  return c.json({ message: "Deleted row" }, 200);
}
