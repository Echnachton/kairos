import { html } from "hono/html";
import type { FC } from "hono/jsx";

const Layout: FC = () => {
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
          </main>

          <button id="start-browser">Start Browser</button>

          {html`
          <script>
            const startBrowserButton = document.getElementById("start-browser");

            startBrowserButton.addEventListener("click", () => {
              fetch("/api/v1/auth/start-browser-with-session")
                .then((response) => response.json())
                .then((data) => console.log(data));
            });
          </script>
        `}
        </body>
      </html>
    </>
  );
};

export default Layout;
