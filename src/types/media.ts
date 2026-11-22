export interface MediaRecord {
  id: number;
  title: string;
  type: string;
  file_path: string | null;
  poster_path: string | null;
  year: number | null;
  duration_minutes: number | null;
  description: string | null;
  created_at: string;
  seasons: Season[];
  periods: SeasonPeriod[];
}

export interface CreateMediaInput {
  title: string;
  type: string;
  year: number | null;
  description: string | null;
  filePath: string | null;
  posterPath: string | null;
  seasons: Season[];
  periods: SeasonPeriod[];
}

export interface UpdateMediaInput {
  id: number;
  title: string;
  type: string;
  year: number | null;
  description: string | null;
  filePath: string | null;
  posterPath: string | null;
  seasons: Season[];
  periods: SeasonPeriod[];
}

export type Season =
  | 'winter'
  | 'spring'
  | 'summer'
  | 'autumn';
export type SeasonPeriod =
  | 'winter_early'
  | 'winter_pre_new_year'
  | 'winter_holidays'
  | 'winter_post_new_year'
  | 'spring_early'
  | 'spring_bloom'
  | 'spring_late'
  | 'summer_early'
  | 'summer_peak'
  | 'summer_late'
  | 'autumn_early'
  | 'autumn_golden'
  | 'autumn_late';
