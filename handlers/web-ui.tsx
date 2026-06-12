import type { Env } from "@/index.ts";
import Layout from "@/views/Layout";
import PresetFiltersTable from "@/views/PresetFiltersTable";
import type { Context } from "hono";

export async function getWebUiLayout(c: Context<Env>) {
  return c.html(
    <Layout>
      <PresetFiltersTable />
    </Layout>,
  );
}
