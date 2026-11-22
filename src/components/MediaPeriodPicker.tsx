import type { Season, SeasonPeriod } from '../types/media';
import { getSeasonLabel } from '../utils/season';
import { SEASON_PERIODS } from '../utils/seasonPeriods';

interface MediaPeriodPickerProps {
  seasons: Season[];
  periods: SeasonPeriod[];
  onChange: (periods: SeasonPeriod[]) => void;
}

export default function MediaPeriodPicker({
  seasons,
  periods,
  onChange,
}: MediaPeriodPickerProps) {
  if (seasons.length === 0) {
    return null;
  }

  const togglePeriod = (id: SeasonPeriod) => {
    onChange(
      periods.includes(id)
        ? periods.filter((period) => period !== id)
        : [...periods, id],
    );
  };

  return (
    <div className="media-period-picker">
      <p className="media-period-picker-title">Периоды сезона (необязательно)</p>
      <p className="media-period-picker-hint">
        Материал будет виден в подборке всего сезона, даже если не выбрать период.
      </p>
      {seasons.map((season) => (
        <fieldset key={season} className="media-period-picker-group">
          <legend>{getSeasonLabel(season)}</legend>
          <div className="media-period-picker-options">
            {SEASON_PERIODS[season].map(({ id, label }) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={periods.includes(id)}
                  onChange={() => togglePeriod(id)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
