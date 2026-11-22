import { useState } from 'react';
import type { FormEvent } from 'react';

import PosterPreview from './PosterPreview';
import MediaPeriodPicker from './MediaPeriodPicker';

import { getSeasonLabel } from '../utils/season';
import { getPeriodLabel, getPeriodSeason } from '../utils/seasonPeriods';

import type {
  MediaRecord,
  Season,
  SeasonPeriod,
  UpdateMediaInput,
} from '../types/media';

interface MediaListProps {
  media: MediaRecord[];
  onUpdate: (
    media: UpdateMediaInput,
  ) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
  emptyMessage?: string;
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'movie':
      return 'Фильм';

    case 'series':
      return 'Сериал';

    case 'cartoon':
      return 'Мультфильм';

    case 'game':
      return 'Игра';

    default:
      return type;
  }
}

function getFileName(filePath: string) {
  return filePath.split(/[\\/]/).pop() ?? filePath;
}

export default function MediaList({
  media,
  onUpdate,
  onDelete,
  emptyMessage = 'Библиотека пока пуста.',
}: MediaListProps) {
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editTitle, setEditTitle] =
    useState('');

  const [editType, setEditType] =
    useState('movie');

  const [editYear, setEditYear] =
    useState('');

  const [
    editDescription,
    setEditDescription,
  ] = useState('');

  const [
    editFilePath,
    setEditFilePath,
  ] = useState<string | null>(null);

  const [
    editPosterPath,
    setEditPosterPath,
  ] = useState<string | null>(null);

  const [
    editSeasons,
    setEditSeasons,
  ] = useState<Season[]>([]);

  const [editPeriods, setEditPeriods] = useState<SeasonPeriod[]>([]);

  const startEditing = (
    item: MediaRecord,
  ) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditType(item.type);

    setEditYear(
      item.year?.toString() ?? '',
    );

    setEditDescription(
      item.description ?? '',
    );

    setEditFilePath(
      item.file_path,
    );

    setEditPosterPath(
      item.poster_path,
    );

    setEditSeasons(
      item.seasons,
    );
    setEditPeriods(item.periods);
  };

  const cancelEditing = () => {
    setEditingId(null);

    setEditTitle('');
    setEditType('movie');
    setEditYear('');
    setEditDescription('');

    setEditFilePath(null);
    setEditPosterPath(null);

    setEditSeasons([]);
    setEditPeriods([]);
  };

  const toggleEditSeason = (
    season: Season,
  ) => {
    setEditPeriods((current) => current.filter(
      (period) => getPeriodSeason(period) !== season,
    ));
    setEditSeasons((current) =>
      current.includes(season)
        ? current.filter(
            (item) => item !== season,
          )
        : [...current, season],
    );
  };

  const handleSelectEditFile =
    async () => {
      const selectedFile =
        await window.electronAPI
          .selectMediaFile();

      if (selectedFile) {
        setEditFilePath(
          selectedFile,
        );
      }
    };

  const handleSelectEditPoster =
    async () => {
      const selectedPoster =
        await window.electronAPI
          .selectPosterFile();

      if (selectedPoster) {
        setEditPosterPath(
          selectedPoster,
        );
      }
    };

  const handleOpenFile = async (
    filePath: string,
  ) => {
    const opened =
      await window.electronAPI
        .openMediaFile(filePath);

    if (!opened) {
      console.error(
        'Failed to open media file',
      );
    }
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

      year: editYear
        ? Number(editYear)
        : null,

      description:
        editDescription || null,

      filePath: editFilePath,
      posterPath: editPosterPath,

      seasons: editSeasons,
      periods: editPeriods,
    });

    if (updated) {
      cancelEditing();
    }
  };

if (media.length === 0) {
  return (
    <p className="media-empty">
      {emptyMessage}
    </p>
  );
}

  return (
    <div className="media-grid">
      {media.map((item) => (
        <article
          className="media-card"
          key={item.id}
        >
          {editingId === item.id ? (
            <form
              className="media-edit-form"
              onSubmit={(event) =>
                handleSubmit(
                  event,
                  item.id,
                )
              }
            >
              <div className="media-edit-poster">
                {editPosterPath ? (
                  <PosterPreview
                    posterPath={
                      editPosterPath
                    }
                    alt={
                      editTitle ||
                      'Постер'
                    }
                  />
                ) : (
                  <div className="media-poster-placeholder">
                    Нет постера
                  </div>
                )}
              </div>

              <label>
                Название

                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(
                      event.target.value,
                    )
                  }
                  required
                />
              </label>

              <label>
                Тип

                <select
                  value={editType}
                  onChange={(event) =>
                    setEditType(
                      event.target.value,
                    )
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
              </label>

              <label>
                Год

                <input
                  type="number"
                  value={editYear}
                  onChange={(event) =>
                    setEditYear(
                      event.target.value,
                    )
                  }
                  placeholder="2001"
                  min="1"
                />
              </label>

              <label>
                Описание

                <textarea
                  value={
                    editDescription
                  }
                  onChange={(event) =>
                    setEditDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Описание"
                />
              </label>

              <div className="media-edit-section">
                <span>Сезоны</span>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      editSeasons.includes(
                        'winter',
                      )
                    }
                    onChange={() =>
                      toggleEditSeason(
                        'winter',
                      )
                    }
                  />

                  Зима
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      editSeasons.includes(
                        'spring',
                      )
                    }
                    onChange={() =>
                      toggleEditSeason(
                        'spring',
                      )
                    }
                  />

                  Весна
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      editSeasons.includes(
                        'summer',
                      )
                    }
                    onChange={() =>
                      toggleEditSeason(
                        'summer',
                      )
                    }
                  />

                  Лето
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      editSeasons.includes(
                        'autumn',
                      )
                    }
                    onChange={() =>
                      toggleEditSeason(
                        'autumn',
                      )
                    }
                  />

                  Осень
                </label>
              </div>

              <MediaPeriodPicker
                seasons={editSeasons}
                periods={editPeriods}
                onChange={setEditPeriods}
              />

              <div className="media-edit-section">
                <span>Видео</span>

                <button
                  type="button"
                  onClick={
                    handleSelectEditFile
                  }
                >
                  Выбрать файл
                </button>

                {editFilePath && (
                  <small>
                    {getFileName(
                      editFilePath,
                    )}
                  </small>
                )}
              </div>

              <div className="media-edit-section">
                <span>Постер</span>

                <button
                  type="button"
                  onClick={
                    handleSelectEditPoster
                  }
                >
                  Выбрать постер
                </button>

                {editPosterPath && (
                  <small>
                    {getFileName(
                      editPosterPath,
                    )}
                  </small>
                )}
              </div>

              <div className="media-edit-actions">
                <button type="submit">
                  Сохранить
                </button>

                <button
                  type="button"
                  onClick={
                    cancelEditing
                  }
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="media-card-poster">
                {item.poster_path ? (
                  <PosterPreview
                    posterPath={
                      item.poster_path
                    }
                    alt={item.title}
                  />
                ) : (
                  <div className="media-poster-placeholder">
                    Нет постера
                  </div>
                )}
              </div>

              <div className="media-card-content">
                <h3 className="media-card-title">
                  {item.title}
                </h3>

                <div className="media-card-meta">
                  <span>
                    {getTypeLabel(
                      item.type,
                    )}
                  </span>

                  {item.year !== null && (
                    <>
                      <span>•</span>

                      <span>
                        {item.year}
                      </span>
                    </>
                  )}
                </div>

                {item.seasons.length > 0 && (
                  <div className="media-card-seasons">
                    {item.seasons.map(
                      (season) => (
                        <span
                          key={season}
                        >
                          {getSeasonLabel(
                            season,
                          )}
                        </span>
                      ),
                    )}
                  </div>
                )}

                {item.periods.length > 0 && (
                  <div className="media-card-periods">
                    {item.periods.map((period) => (
                      <span key={period}>{getPeriodLabel(period)}</span>
                    ))}
                  </div>
                )}

                {item.description && (
                  <p className="media-card-description">
                    {
                      item.description
                    }
                  </p>
                )}

                {item.file_path && (
                  <p className="media-card-file">
                    {getFileName(
                      item.file_path,
                    )}
                  </p>
                )}

                <div className="media-card-actions">
                  {item.file_path && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenFile(
                          item.file_path!,
                        )
                      }
                    >
                      Открыть
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(
                        item,
                      )
                    }
                  >
                    Изменить
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        item.id,
                      )
                    }
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
}