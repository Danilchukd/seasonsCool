import type { Season } from '../types/media';

export function getCurrentSeason(): Season {
  const month = new Date().getMonth();

  if (month === 11 || month <= 1) {
    return 'winter';
  }

  if (month >= 2 && month <= 4) {
    return 'spring';
  }

  if (month >= 5 && month <= 7) {
    return 'summer';
  }

  return 'autumn';
}

export function getSeasonLabel(
  season: Season,
): string {
  switch (season) {
    case 'winter':
      return 'Зима';

    case 'spring':
      return 'Весна';

    case 'summer':
      return 'Лето';

    case 'autumn':
      return 'Осень';
  }
}