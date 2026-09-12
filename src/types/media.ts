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
}

export interface CreateMediaInput {
  title: string;
  type: string;
  year: number | null;
  description: string | null;
  filePath: string | null;
  posterPath: string | null;
  seasons: Season[];
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
}

export type Season =
  | 'winter'
  | 'spring'
  | 'summer'
  | 'autumn';