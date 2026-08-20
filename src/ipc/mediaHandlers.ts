import { ipcMain } from 'electron';

import {
  addMedia,
  deleteMedia,
  getMedia,
  updateMedia,
} from '../services/databaseService';

import type {
  CreateMediaInput,
  UpdateMediaInput,
} from '../types/media';

export function registerMediaHandlers() {
  ipcMain.handle(
    'media:add',
    async (_event, media: CreateMediaInput) => {
      return addMedia(media.title, media.type);
    },
  );

  ipcMain.handle('media:getAll', async () => {
    return getMedia();
  });

  ipcMain.handle(
    'media:delete',
    async (_event, id: number) => {
      return deleteMedia(id);
    },
  );

  ipcMain.handle(
    'media:update',
    async (_event, media: UpdateMediaInput) => {
      return updateMedia(
        media.id,
        media.title,
        media.type,
      );
    },
  );
}