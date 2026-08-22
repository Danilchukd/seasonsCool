import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import MediaForm from './components/MediaForm';
import MediaList from './components/MediaList';

import type {
  CreateMediaInput,
  MediaRecord,
  UpdateMediaInput,
} from './types/media';

export default function App() {
  const [addedMediaId, setAddedMediaId] =
    useState<number | null>(null);

  const [media, setMedia] =
    useState<MediaRecord[]>([]);

  const loadMedia = useCallback(async () => {
    const result = await window.electronAPI.getMedia();
    setMedia(result);
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const handleAddMedia = async (
    newMedia: CreateMediaInput,
  ) => {
    const id = await window.electronAPI.addMedia(newMedia);

    setAddedMediaId(id);

    await loadMedia();
  };

  const handleDeleteMedia = async (id: number) => {
    const deleted = await window.electronAPI.deleteMedia(id);

    if (deleted) {
      await loadMedia();
    }
  };

  const handleUpdateMedia = async (
    updatedMedia: UpdateMediaInput,
  ): Promise<boolean> => {
    const updated =
      await window.electronAPI.updateMedia(updatedMedia);

    if (updated) {
      await loadMedia();
    }

    return updated;
  };

  return (
    <div>
      <h1>SeasonsCool</h1>

      <h2>Добавить медиа</h2>

      <MediaForm onAdd={handleAddMedia} />

      {addedMediaId !== null && (
        <p>
          Запись добавлена. ID: {addedMediaId}
        </p>
      )}

      <h2>Библиотека</h2>

      <MediaList
        media={media}
        onUpdate={handleUpdateMedia}
        onDelete={handleDeleteMedia}
      />
    </div>
  );
}