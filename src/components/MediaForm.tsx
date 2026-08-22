import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateMediaInput } from '../types/media';

interface MediaFormProps {
  onAdd: (media: CreateMediaInput) => Promise<void>;
}

export default function MediaForm({ onAdd }: MediaFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    await onAdd({
      title,
      type,
    });

    setTitle('');
    setType('movie');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="media-title">
          Название
        </label>

        <input
          id="media-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Например, Shrek"
          required
        />
      </div>

      <div>
        <label htmlFor="media-type">
          Тип
        </label>

        <select
          id="media-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="movie">Фильм</option>
          <option value="series">Сериал</option>
          <option value="cartoon">Мультфильм</option>
          <option value="game">Игра</option>
        </select>
      </div>

      <button type="submit">
        Добавить
      </button>
    </form>
  );
}