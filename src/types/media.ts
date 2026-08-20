export interface MediaRecord {
  id: number;
  title: string;
  type: string;
}

export interface CreateMediaInput {
  title: string;
  type: string;
}

export interface UpdateMediaInput {
  id: number;
  title: string;
  type: string;
}