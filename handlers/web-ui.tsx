import type { Env } from "@/index.ts";
import Layout from "@/views/Layout";
import type { Context } from "hono";

export async function getWebUiLayout(c: Context<Env>) {
  return c.html(<Layout />);
}
