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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="design-tokens.css" />
          <link rel="stylesheet" href="main.css" />
        </head>

        <body>
          <nav class="topnav">
            <div class="topnav__inner">
              <span class="brand">
                <span class="brand__dot"></span>Kairos
              </span>

              <a
                class="navlink"
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
                class="navlink"
                href="/preset-filters"
                role="tab"
                hx-get="/preset-filters"
                hx-target="#main-content"
                hx-push-url="true"
              >
                Filter Presets
              </a>
            </div>
          </nav>

          <main id="main-content">
            {children}
          </main>
        </body>
      </html>
    </>
  );
};

export default Layout;
