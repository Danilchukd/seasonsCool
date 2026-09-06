import type {
  CreateMediaInput,
  MediaRecord,
  UpdateMediaInput,
} from './media';

export interface ElectronAPI {

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