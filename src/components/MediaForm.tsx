import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateMediaInput, Season, } from '../types/media';
import PosterPreview from './PosterPreview';

interface MediaFormProps {
  onAdd: (media: CreateMediaInput) => Promise<void>;
}

export default function MediaForm({ onAdd }: MediaFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [posterPath, setPosterPath] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);

  const handleSelectFile = async () => {
    const selectedFile =
      await window.electronAPI.selectMediaFile();

    if (selectedFile) {
      setFilePath(selectedFile);
    }
  };

  const handleSelectPoster = async () => {
    const selectedPoster =
      await window.electronAPI.selectPosterFile();

    if (selectedPoster) {
      setPosterPath(selectedPoster);
    }
  };

  const toggleSeason = (
    season: Season,
  ) => {
    setSeasons((current) =>
      current.includes(season)
        ? current.filter(
          (item) => item !== season,
        )
        : [...current, season],
    );
  };

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
      year: year ? Number(year) : null,
      description: description || null,
      filePath,
      posterPath,
      seasons,
    });

    setTitle('');
    setType('movie');
    setYear('');
    setDescription('');
    setFilePath(null);
    setPosterPath(null);
    setSeasons([]);
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
        <p>Сезоны</p>

        <label>
          <input
            type="checkbox"
            checked={seasons.includes('winter')}
            onChange={() => toggleSeason('winter')}
          />
          Зима
        </label>

        <label>
          <input
            type="checkbox"
            checked={seasons.includes('spring')}
            onChange={() => toggleSeason('spring')}
          />
          Весна
        </label>

        <label>
          <input
            type="checkbox"
            checked={seasons.includes('summer')}
            onChange={() => toggleSeason('summer')}
          />
          Лето
        </label>

        <label>
          <input
            type="checkbox"
            checked={seasons.includes('autumn')}
            onChange={() => toggleSeason('autumn')}
          />
          Осень
        </label>
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
          <option value="clip">Клип</option>
        </select>
      </div>

      <div>
        <label htmlFor="media-year">Год выпуска</label>

        <input
          id="media-year"
          type="number"
          min="1"
          step="1"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          placeholder="Например, 2001"
        />
      </div>

      <div>
        <label htmlFor="media-description">Описание</label>

        <textarea
          id="media-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Короткое описание или личная заметка"
        />
      </div>

      <div>
        <label>Файл</label>

        <button
          type="button"
          onClick={handleSelectFile}
        >
          Выбрать файл
        </button>

        {filePath && (
          <p>{filePath}</p>
        )}
      </div>

      <div>
  <p>Постер</p>

        <button
          type="button"
          onClick={handleSelectPoster}
        >
          Выбрать постер
        </button>

        {posterPath && (
          <>
            <p>{posterPath}</p>

            <PosterPreview
              posterPath={posterPath}
              alt={title || 'Постер'}
            />
          </>
        )}
      </div>

      <button type="submit">
        Добавить
      </button>
    </form>
  );
}