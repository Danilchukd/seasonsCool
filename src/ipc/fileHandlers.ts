import {
    dialog,
    ipcMain,
    shell,
} from 'electron';

export function registerFileHandlers() {
    ipcMain.handle('file:selectMedia', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {
                    name: 'Видео',
                    extensions: [
                        'mp4',
                        'mkv',
                        'avi',
                        'mov',
                        'webm',
                        'm4v',
                    ],
                },
            ],
        });

        if (
            result.canceled ||
            result.filePaths.length === 0
        ) {
            return null;
        }

        return result.filePaths[0];
    });

    ipcMain.handle(
        'file:openMedia',
        async (_event, filePath: unknown) => {
            if (
                typeof filePath !== 'string' ||
                filePath.trim().length === 0
            ) {
                return false;
            }

            const errorMessage = await shell.openPath(filePath);

            return errorMessage.length === 0;
        },
    );
}