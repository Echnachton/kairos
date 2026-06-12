import type { FC } from "hono/jsx";

const PresetFiltersTable: FC = () => {
  return (
    <>
      <header class="page-head">
        <div>
          <h1 class="page-head__title">Filter Presets</h1>
          <p class="page-head__sub">
            Saved URL + filter pairs to scan with Playwright.
          </p>
        </div>
        <div style="display: flex; align-items: center">
          <span class="browser-status">
            <span
              class="status-dot"
              id="statusDot"
            >
            </span>
            <span id="statusText">Browser idle</span>
          </span>

          <button
            class="btn"
            id="startBtn"
            type="button"
            hx-get="/api/v1/auth/start-browser-with-session"
          >
            Start Browser
          </button>
        </div>
      </header>

      <section class="card">
        <div
          id="preset-table-header"
          class="card__head"
          hx-get="/preset-filters-table-header"
          hx-swap="innerHTML"
          hx-trigger="load, refresh"
        >
        </div>

        <form
          id="add-preset-form"
          hx-post="/api/v1/preset_filters/"
          hx-ext="json-enc"
          hx-swap="none"
          {...{
            "hx-on:htmx:after-request":
              "if (event.detail.successful) { event.target.reset(); htmx.trigger('#preset-table-filters', 'refresh'); htmx.trigger('#preset-table-header', 'refresh'); }",
          }}
        />

        <table>
          <thead>
            <tr>
              <th class="col-name">Name</th>
              <th class="col-filter">Filter</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>

          <tbody
            id="preset-table-filters"
            hx-get="/preset-filters-table-row"
            hx-swap="innerHTML"
            hx-trigger="load, refresh"
          >
          </tbody>

          <tfoot>
            <tr class="add-row">
              <td style="padding: 12px">
                <input
                  class="input"
                  type="text"
                  placeholder="name"
                  aria-label="New preset name"
                  name="display_name"
                  form="add-preset-form"
                />
              </td>
              <td style="padding: 12px 11px 12px 12px">
                <input
                  class="input"
                  type="text"
                  placeholder="filter"
                  aria-label="New preset filter"
                  name="filter_string"
                  form="add-preset-form"
                />
              </td>
              <td class="col-actions">
                <span class="row-actions">
                  <button
                    form="add-preset-form"
                    class="btn btn--primary btn--sm"
                    type="submit"
                  >
                    Add preset
                  </button>
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </section>
    </>
  );
};

export default PresetFiltersTable;
