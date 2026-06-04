import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "hono/bun";
import { join } from "node:path";

const WEB_ROOT = join(import.meta.dirname, "web");

const app = new Hono();

app.use('*', serveStatic({ 
    root: WEB_ROOT
}));

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    console.error(err);
    return c.text("Internal Server Error", 500);
});

app.get("/api", (c) => c.text("Hello World"));

export default app;