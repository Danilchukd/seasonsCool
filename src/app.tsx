import { useState } from 'react';
import type { MediaRecord } from './types/media';

export default function App() {
  const [response, setResponse] = useState('');
  const [addedMediaId, setAddedMediaId] = useState<number | null>(null);
  const [media, setMedia] = useState<MediaRecord[]>([]);

  const handleAddMedia = async () => {
    const id = await window.electronAPI.addMedia({
      title: 'Shrek',
      type: 'movie',
    });

    setAddedMediaId(id);
  };

  const handleLoadMedia = async () => {
    const result = await window.electronAPI.getMedia();
    setMedia(result);
  };

  const handleDeleteMedia = async (id: number) => {
    const deleted = await window.electronAPI.deleteMedia(id);

    if (deleted) {
      const updatedMedia = await window.electronAPI.getMedia();
      setMedia(updatedMedia);
    }
  };

  const handleUpdateMedia = async (id: number) => {
    const updated = await window.electronAPI.updateMedia({
      id,
      title: 'Shrek 2',
      type: 'movie',
    });

    if (updated) {
      const updatedMedia = await window.electronAPI.getMedia();
      setMedia(updatedMedia);
    }
  };

  return (
    <div>
      <h1>SeasonsCool</h1>

      <button onClick={handleAddMedia}>
        Добавить Shrek
      </button>

      {addedMediaId !== null && (
        <p>Запись добавлена. ID: {addedMediaId}</p>
      )}

      <button onClick={handleLoadMedia}>
        Загрузить библиотеку
      </button>

      <h2>Библиотека</h2>

      {media.length === 0 ? (
        <p>Библиотека пока не загружена.</p>
      ) : (
        <ul>
          {media.map((item) => (
            <li key={item.id}>
              {item.title} — {item.type}

              <button onClick={() => handleUpdateMedia(item.id)}>
                Изменить
              </button>

              <button onClick={() => handleDeleteMedia(item.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}