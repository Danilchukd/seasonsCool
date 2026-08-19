import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    ping: (): Promise<string> => ipcRenderer.invoke('ping'),

    addMedia: (title: string, type: string): Promise<number> =>
        ipcRenderer.invoke('media:add', title, type),

    getMedia: () => ipcRenderer.invoke('media:getAll'),

    deleteMedia: (id: number): Promise<boolean> =>
        ipcRenderer.invoke('media:delete', id),

    updateMedia: (
        id: number,
        title: string,
        type: string,
    ): Promise<boolean> =>
        ipcRenderer.invoke('media:update', id, title, type),
});