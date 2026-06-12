import Layout from "@/views/Layout";
import type { Context } from "hono";
import type { HtmlEscapedString } from "hono/utils/html";

function appendLayout(
  c: Context,
  fragment: HtmlEscapedString | Promise<HtmlEscapedString>,
) {
  return c.req.header("HX-Request")
    ? c.html(fragment)
    : c.html(<Layout>{fragment}</Layout>);
}

export default appendLayout;
