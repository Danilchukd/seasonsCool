import type { Season, SeasonPeriod } from '../types/media';
import { SEASON_PERIODS } from '../utils/seasonPeriods';

interface SeasonPeriodSelectorProps {
  season: Season;
  selectedPeriod: SeasonPeriod | null;
  onSelect: (period: SeasonPeriod | null) => void;
}

export default function SeasonPeriodSelector({
  season,
  selectedPeriod,
  onSelect,
}: SeasonPeriodSelectorProps) {
  return (
    <div className="season-period-selector" aria-label="Период сезона">
      <span className="season-period-heading">Период</span>
      <div className="season-period-options">
        <button
          type="button"
          className={selectedPeriod === null ? 'active' : ''}
          aria-pressed={selectedPeriod === null}
          onClick={() => onSelect(null)}
        >
          Весь сезон
        </button>
        {SEASON_PERIODS[season].map(({ id, label }) => (
          <button
            type="button"
            key={id}
            className={selectedPeriod === id ? 'active' : ''}
            aria-pressed={selectedPeriod === id}
            onClick={() => onSelect(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
