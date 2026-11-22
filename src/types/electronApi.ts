import type {
  CreateMediaInput,
  MediaRecord,
  UpdateMediaInput,
} from './media';
import type {
  CreateSeasonPlanInput,
  SeasonPlan,
  SeasonPlanQuery,
  UpdateSeasonPlanInput,
} from './seasonPlan';

export interface ElectronAPI {
  getSeasonPlans: (query: SeasonPlanQuery) => Promise<SeasonPlan[]>;
  createSeasonPlan: (plan: CreateSeasonPlanInput) => Promise<number>;
  updateSeasonPlan: (plan: UpdateSeasonPlanInput) => Promise<boolean>;
  deleteSeasonPlan: (id: number) => Promise<boolean>;


  addMedia: (
    media: CreateMediaInput,
  ) => Promise<number>;

  getMedia: () => Promise<MediaRecord[]>;

  deleteMedia: (
    id: number,
  ) => Promise<boolean>;

  updateMedia: (
    media: UpdateMediaInput,
  ) => Promise<boolean>;

  selectMediaFile: () => Promise<string | null>;
  openMediaFile: (filePath: string) => Promise<boolean>;
  selectPosterFile: () => Promise<string | null>;

  getPosterDataUrl: (
    posterPath: string,
  ) => Promise<string | null>;
}