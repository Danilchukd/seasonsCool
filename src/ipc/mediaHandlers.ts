import { ipcMain } from 'electron';

import {
  addMedia,
  deleteMedia,
  getMedia,
  updateMedia,
} from '../services/databaseService';

import {
  validateCreateMediaInput,
  validateMediaId,
  validateUpdateMediaInput,
} from '../validators/mediaValidator';

export function registerMediaHandlers() {
  ipcMain.handle(
    'media:add',
    async (_event, input: unknown) => {
      const media = validateCreateMediaInput(input);

      return addMedia(media);
    },
  );

  ipcMain.handle('media:getAll', async () => {
    return getMedia();
  });

  ipcMain.handle(
    'media:delete',
    async (_event, input: unknown) => {
      const id = validateMediaId(input);

      return deleteMedia(id);
    },
  );

  ipcMain.handle(
    'media:update',
    async (_event, input: unknown) => {
      const media = validateUpdateMediaInput(input);

      return updateMedia(media);
    },
  );
}