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

  openMediaFile: (filePath) =>
    ipcRenderer.invoke('file:openMedia', filePath),
};

contextBridge.exposeInMainWorld(
  'electronAPI',
  electronAPI,
);