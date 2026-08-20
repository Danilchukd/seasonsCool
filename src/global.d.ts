import type { ElectronAPI } from './types/electronApi';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};