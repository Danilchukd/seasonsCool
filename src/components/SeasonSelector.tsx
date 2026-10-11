import {
  SEASONS,
  getSeasonLabel,
} from '../utils/season';

import type { Season } from '../types/media';

interface SeasonSelectorProps {
  selectedSeason: Season;
  onSelect: (season: Season) => void;
}

export default function SeasonSelector({
  selectedSeason,
  onSelect,
}: SeasonSelectorProps) {
  return (
    <div className="season-selector">
      {SEASONS.map((season) => (
        <button
          key={season}
          type="button"
          className={
            selectedSeason === season
              ? 'season-selector-button active'
              : 'season-selector-button'
          }
          onClick={() => onSelect(season)}
        >
          {getSeasonLabel(season)}
        </button>
      ))}
    </div>
  );
}