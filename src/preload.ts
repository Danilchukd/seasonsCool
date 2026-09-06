import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from './types/electronApi';

const electronAPI: ElectronAPI = {

  addMedia: (media) =>
    ipcRenderer.invoke('media:add', media),

  getMedia: () =>
    ipcRenderer.invoke('media:getAll'),

  deleteMedia: (id) =>
    ipcRenderer.invoke('media:delete', id),

  updateMedia: (media) =>
    ipcRenderer.invoke('media:update', media),

  selectMediaFile: () =>
    ipcRenderer.invoke('file:selectMedia'),

  selectPosterFile: () =>
    ipcRenderer.invoke('file:selectPoster'),

  openMediaFile: (filePath) =>
    ipcRenderer.invoke('file:openMedia', filePath),

  getPosterDataUrl: (posterPath) =>
    ipcRenderer.invoke(
      'file:getPosterDataUrl',
      posterPath,
    ),
};

contextBridge.exposeInMainWorld(
  'electronAPI',
  electronAPI,
);