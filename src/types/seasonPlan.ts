import type { Season } from './media';

export interface SeasonPlan {
  id: number;
  season: Season;
  seasonYear: number;
  title: string;
  completed: boolean;
  mediaId: number | null;
  createdAt: string;
}

export interface SeasonPlanQuery {
  season: Season;
  seasonYear: number;
}

export interface CreateSeasonPlanInput extends SeasonPlanQuery {
  title: string;
  mediaId: number | null;
}

export interface UpdateSeasonPlanInput {
  id: number;
  title: string;
  completed: boolean;
}
