import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from './types/electronApi';

const electronAPI: ElectronAPI = {
  getSeasonPlans: (query) =>
    ipcRenderer.invoke('seasonPlans:get', query),
  createSeasonPlan: (plan) =>
    ipcRenderer.invoke('seasonPlans:create', plan),
  updateSeasonPlan: (plan) =>
    ipcRenderer.invoke('seasonPlans:update', plan),
  deleteSeasonPlan: (id) =>
    ipcRenderer.invoke('seasonPlans:delete', id),


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