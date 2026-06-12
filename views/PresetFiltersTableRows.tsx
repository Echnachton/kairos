import type { PresetFilter } from "@/database/preset-filters";
import type { FC } from "hono/jsx";

type Props = {
  rows: PresetFilter[];
};

const PresetFiltersTableRows: FC<Props> = ({
  rows,
}) => {
  return (
    <>
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
                  hx-delete={`/api/v1/preset_filters/?id=${
                    encodeURIComponent(row.id)
                  }`}
                  hx-swap="none"
                  {...{
                    "hx-on:htmx:after-request":
                      "if (event.detail.successful) { htmx.trigger('#preset-table-filters', 'refresh'); htmx.trigger('#preset-table-header', 'refresh'); }",
                  }}
                >
                  Delete
                </button>
              </span>
            </td>
          </tr>
        ))}
    </>
  );
};

export default PresetFiltersTableRows;
