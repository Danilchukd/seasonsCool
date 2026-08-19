export {};

declare global {
  interface MediaRecord {
    id: number;
    title: string;
    type: string;
    file_path: string | null;
    poster_path: string | null;
    year: number | null;
    duration_minutes: number | null;
    description: string | null;
    created_at: string;
  }

  interface Window {
    electronAPI: {
      ping: () => Promise<string>;

      addMedia: (
        title: string,
        type: string,
      ) => Promise<number>;

      getMedia: () => Promise<MediaRecord[]>;

      deleteMedia: (id: number) => Promise<boolean>;

      updateMedia: (
        id: number,
        title: string,
        type: string,
      ) => Promise<boolean>;
    };
  }
}