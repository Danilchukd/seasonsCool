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

  const startEditing = (item: MediaRecord) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditType(item.type);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditType('movie');
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
    });

    if (updated) {
      cancelEditing();
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
              <input
                type="text"
                value={editTitle}
                onChange={(event) =>
                  setEditTitle(event.target.value)
                }
                required
              />

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
              </select>

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
              {item.title} — {item.type}

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