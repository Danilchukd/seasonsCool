import {
    dialog,
    ipcMain,
    shell,
} from 'electron';

import {
    readFile,
} from 'node:fs/promises';

import path from 'node:path';

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

    ipcMain.handle('file:selectPoster', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {
                    name: 'Изображения',
                    extensions: [
                        'jpg',
                        'jpeg',
                        'png',
                        'webp',
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
        'file:getPosterDataUrl',
        async (_event, posterPath: unknown) => {
            if (
                typeof posterPath !== 'string' ||
                posterPath.trim().length === 0
            ) {
                return null;
            }

            const extension =
                path.extname(posterPath).toLowerCase();

            const mimeTypes: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
            };

            const mimeType = mimeTypes[extension];

            if (!mimeType) {
                return null;
            }

            try {
                const file = await readFile(posterPath);
                const base64 = file.toString('base64');

                return `data:${mimeType};base64,${base64}`;
            } catch (error) {
                console.error(
                    'Failed to read poster:',
                    error,
                );

                return null;
            }
        },
    );
}