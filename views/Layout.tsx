import { html } from "hono/html";
import type { Child, FC } from "hono/jsx";

type Props = {
  children?: Child;
};

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      {html`<!DOCTYPE html>`}

      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Kairos</title>
          <script
            src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.10/dist/htmx.min.js"
            integrity="sha384-H5SrcfygHmAuTDZphMHqBJLc3FhssKjG7w/CeCpFReSfwBWDTKpkzPP8c+cLsK+V"
            crossorigin="anonymous"
          >
          </script>
        </head>

        <body>
          <nav>
            <a
              href="/"
              role="tab"
              hx-get="/"
              hx-target="#main-content"
              hx-select="#main-content"
              hx-push-url="true"
            >
              Home
            </a>

            <a
              href="/preset-filters"
              role="tab"
              hx-get="/preset-filters"
              hx-target="#main-content"
              hx-push-url="true"
            >
              Filter Presets
            </a>
          </nav>

          <h1>Kairos</h1>

          <main id="main-content">
            {children}
          </main>

          <button
            id="start-browser"
            hx-get="/api/v1/auth/start-browser-with-session"
          >
            Start Browser
          </button>
        </body>
      </html>
    </>
  );
};

export default Layout;
