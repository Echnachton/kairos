import type { Env } from "@/index.ts";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { safeParse, type ZodType } from "zod";

type Props<T> = {
  schema: ZodType<T>;
  c: Context<Env>;
};

function extractQueryParams<T>({
  schema,
  c,
}: Props<T>) {
  const queryParams = c.req.query();
  const parsedParams = safeParse(schema, queryParams);

  if (!parsedParams.success) {
    throw new HTTPException(400, {
      res: c.json({ message: "Bad query param" }),
    });
  }

  return parsedParams;
}

export default extractQueryParams;
