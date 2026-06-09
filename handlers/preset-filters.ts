import { presetFiltersTable } from "@/database/preset-filters";
import type { Env } from "@/index.ts";
import { type Context } from "hono";
import { safeParse, z } from "zod";

type PostPresetFiltersBody = z.infer<typeof postPresetFiltersBody>;

const postPresetFiltersBody = z.object({
  display_name: z.string(),
  filter_string: z.string(),
});

export async function postPresetFiltersHandler(c: Context<Env>) {
  const db = c.get("db");
  const body = await c.req.json<PostPresetFiltersBody>();

  try {
    safeParse(postPresetFiltersBody, body);
  } catch (error) {
    return c.json({ message: "Bad request body" }, 400);
  }

  await db.insert(presetFiltersTable).values({
    displayName: body.display_name,
    createdAt: new Date(),
    filterString: body.filter_string,
  });

  return c.json({ message: "Success" }, 200);
}
