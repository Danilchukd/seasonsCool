import { useState } from 'react';
import type { FormEvent } from 'react';

import type {
  MediaRecord,
  UpdateMediaInput,
} from '../types/media';

interface MediaListProps {
  media: MediaRecord[];
  onUpdate: (media: UpdateMediaInput) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
}

export default function MediaList({
  media,
  onUpdate,
  onDelete,
}: MediaListProps) {
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('movie');
  const [editYear, setEditYear] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFilePath, setEditFilePath] = useState<string | null>(null);

  const startEditing = (item: MediaRecord) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditType(item.type);
    setEditYear(item.year?.toString() ?? '');
    setEditDescription(item.description ?? '');
    setEditFilePath(item.file_path);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditType('movie');
    setEditYear('');
    setEditDescription('');
    setEditFilePath(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    event.preventDefault();

    if (!editTitle.trim()) {
      return;
    }

    const updated = await onUpdate({
      id,
      title: editTitle,
      type: editType,
      year: editYear ? Number(editYear) : null,
      description: editDescription || null,
      filePath: editFilePath,
    });

    if (updated) {
      cancelEditing();
    }
  };

  const handleSelectEditFile = async () => {
    const selectedFile =
      await window.electronAPI.selectMediaFile();

    if (selectedFile) {
      setEditFilePath(selectedFile);
    }
  };

  const handleOpenFile = async (filePath: string) => {
    const opened =
      await window.electronAPI.openMediaFile(filePath);

    if (!opened) {
      console.error('Failed to open media file');
    }
  };

  if (media.length === 0) {
    return <p>Библиотека пуста.</p>;
  }

  return (
    <ul>
      {media.map((item) => (
        <li key={item.id}>
          {editingId === item.id ? (
            <form
              onSubmit={(event) =>
                handleSubmit(event, item.id)
              }
            >
              <div>
                <label>
                  Название
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label>
                  Тип
                </label>

                <select
                  value={editType}
                  onChange={(event) =>
                    setEditType(event.target.value)
                  }
                >
                  <option value="movie">
                    Фильм
                  </option>

                  <option value="series">
                    Сериал
                  </option>

                  <option value="cartoon">
                    Мультфильм
                  </option>

                  <option value="game">
                    Игра
                  </option>

                  <option value="clip">
                    Клип
                  </option>
                </select>
              </div>

              <div>
                <label>
                  Год
                </label>

                <input
                  type="number"
                  value={editYear}
                  onChange={(event) =>
                    setEditYear(event.target.value)
                  }
                  placeholder="2001"
                  min="1"
                />
              </div>

              <div>
                <label>
                  Описание
                </label>

                <textarea
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                  placeholder="Описание"
                />
              </div>

              <div>
                <label>Файл</label>

                <button
                  type="button"
                  onClick={handleSelectEditFile}
                >
                  Выбрать другой файл
                </button>

                {editFilePath && (
                  <p>{editFilePath}</p>
                )}
              </div>

              <button type="submit">
                Сохранить
              </button>

              <button
                type="button"
                onClick={cancelEditing}
              >
                Отмена
              </button>
            </form>
          ) : (
            <>
              <div>
                <strong>{item.title}</strong>
                {' — '}
                {item.type}

                {item.year !== null && (
                  <span> ({item.year})</span>
                )}

                {item.description && (
                  <p>{item.description}</p>
                )}

                {item.file_path && (
                  <div>
                    <p>
                      Файл: {item.file_path}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleOpenFile(item.file_path!)}
                    >
                      Открыть
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => startEditing(item)}
              >
                Изменить
              </button>

              <button
                onClick={() => onDelete(item.id)}
              >
                Удалить
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}