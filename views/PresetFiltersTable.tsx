import type { PresetFilter } from "@/database/preset-filters";
import type { FC } from "hono/jsx";

type Props = {
  rows: PresetFilter[];
};

const PresetFiltersTable: FC<Props> = ({
  rows,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Filter</th>
          <th />
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
              <td>{row.displayName}</td>
              <td>{row.filterString}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default PresetFiltersTable;
