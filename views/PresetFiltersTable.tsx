import type { PresetFilter } from "@/database/preset-filters";
import type { FC } from "hono/jsx";

type Props = {
  rows: PresetFilter[];
};

const PresetFiltersTable: FC<Props> = ({
  rows,
}) => {
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
        <div class="card__head">
          <h2 class="card__title">Presets</h2>
          <span class="card__count">3 saved</span>
        </div>

        <table>
          <thead>
            <tr>
              <th class="col-name">Name</th>
              <th class="col-filter">Filter</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0
              ? (
                <tr>
                  <td colSpan={3}>No presets yet.</td>
                </tr>
              )
              : rows.map((row) => (
                <tr key={row.id}>
                  <td class="cell-name">{row.displayName}</td>
                  <td class="cell-filter">{row.filterString}</td>
                  <td class="col-actions">
                    <span class="row-actions">
                      <button
                        class="btn btn--accent-soft btn--sm"
                        type="button"
                      >
                        Scan
                      </button>
                      <button
                        class="btn btn--ghost-danger btn--sm"
                        type="button"
                      >
                        Delete
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>

          <tfoot>
            <form>
              <tr class="add-row">
                <td style="padding: 12px">
                  <input
                    class="input"
                    type="text"
                    placeholder="name"
                    aria-label="New preset name"
                  />
                </td>
                <td style="padding: 12px 11px 12px 12px">
                  <input
                    class="input"
                    type="text"
                    placeholder="filter"
                    aria-label="New preset filter"
                  />
                </td>
                <td class="col-actions">
                  <span class="row-actions">
                    <button class="btn btn--primary btn--sm" type="submit">
                      Add preset
                    </button>
                  </span>
                </td>
              </tr>
            </form>
          </tfoot>
        </table>
      </section>
    </>
  );
};

export default PresetFiltersTable;
