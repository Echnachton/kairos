import type { FC } from "hono/jsx";

type Props = {
  total: number;
};

const PresetFiltersTableHeader: FC<Props> = ({
  total,
}) => {
  return (
    <>
      <h2 class="card__title">Presets</h2>
      <span class="card__count">{`${total}`} saved</span>
    </>
  );
};

export default PresetFiltersTableHeader;
