import type { Season, SeasonPeriod } from '../types/media';
import { SEASONS } from './season';

export interface SeasonPeriodOption {
  id: SeasonPeriod;
  label: string;
}

export const SEASON_PERIODS: Record<Season, SeasonPeriodOption[]> = {
  winter: [
    { id: 'winter_early', label: 'Ранняя зима' },
    { id: 'winter_pre_new_year', label: 'Предновогодний период' },
    { id: 'winter_holidays', label: 'Новогодние праздники' },
    { id: 'winter_post_new_year', label: 'После праздников' },
  ],
  spring: [
    { id: 'spring_early', label: 'Ранняя весна' },
    { id: 'spring_bloom', label: 'Цветущая весна' },
    { id: 'spring_late', label: 'Поздняя весна' },
  ],
  summer: [
    { id: 'summer_early', label: 'Начало лета' },
    { id: 'summer_peak', label: 'Разгар лета' },
    { id: 'summer_late', label: 'Конец лета' },
  ],
  autumn: [
    { id: 'autumn_early', label: 'Ранняя осень' },
    { id: 'autumn_golden', label: 'Золотая осень' },
    { id: 'autumn_late', label: 'Поздняя осень' },
  ],
};

export function getPeriodSeason(period: SeasonPeriod): Season {
  for (const season of SEASONS) {
    if (SEASON_PERIODS[season].some((option) => option.id === period)) {
      return season;
    }
  }

  throw new Error('Unknown season period: ' + period);
}

export function getPeriodLabel(period: SeasonPeriod): string {
  const season = getPeriodSeason(period);
  const option = SEASON_PERIODS[season].find((item) => item.id === period);
  return option ? option.label : period;
}

export function isSeasonPeriod(value: unknown): value is SeasonPeriod {
  return typeof value === 'string' && SEASONS.some((season) =>
    SEASON_PERIODS[season].some((option) => option.id === value),
  );
}
