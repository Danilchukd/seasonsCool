import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import MediaForm from './components/MediaForm';
import MediaList from './components/MediaList';

import {
  getCurrentSeason,
  getSeasonLabel,
} from './utils/season';

import type {
  CreateMediaInput,
  MediaRecord,
  UpdateMediaInput,
} from './types/media';

export default function App() {
  const [media, setMedia] =
    useState<MediaRecord[]>([]);

  const [isAddFormOpen, setIsAddFormOpen] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const currentSeason = getCurrentSeason();

  const currentSeasonMedia = media.filter(
    (item) =>
      item.seasons.includes(currentSeason),
  );

  const loadMedia = useCallback(async () => {
    const result =
      await window.electronAPI.getMedia();

    setMedia(result);
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const handleAddMedia = async (
    newMedia: CreateMediaInput,
  ) => {
    await window.electronAPI.addMedia(newMedia);

    await loadMedia();

    setMessage(`Добавлено: ${newMedia.title}`);
    setIsAddFormOpen(false);
  };

  const handleDeleteMedia = async (
    id: number,
  ) => {
    const deleted =
      await window.electronAPI.deleteMedia(id);

    if (deleted) {
      await loadMedia();
    }
  };

  const handleUpdateMedia = async (
    updatedMedia: UpdateMediaInput,
  ): Promise<boolean> => {
    const updated =
      await window.electronAPI.updateMedia(
        updatedMedia,
      );

    if (updated) {
      await loadMedia();
    }

    return updated;
  };

  const handleOpenAddForm = () => {
    setMessage(null);
    setIsAddFormOpen(true);
  };

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">
            SeasonsCool
          </h1>

          <p className="app-subtitle">
            Сейчас: {getSeasonLabel(currentSeason)}
          </p>
        </div>

        <button
          className="add-media-button"
          type="button"
          onClick={handleOpenAddForm}
          disabled={isAddFormOpen}
        >
          + Добавить медиа
        </button>
      </header>

      {isAddFormOpen && (
        <section className="media-form-panel">
          <div className="media-form-header">
            <div>
              <h2>Добавить медиа</h2>

              <p>
                Добавь фильм, сериал, игру,
                клип или другой контент.
              </p>
            </div>

            <button
              className="media-form-close"
              type="button"
              onClick={() =>
                setIsAddFormOpen(false)
              }
              aria-label="Закрыть форму"
            >
              ×
            </button>
          </div>

          <MediaForm
            onAdd={handleAddMedia}
          />
        </section>
      )}

      {message && (
        <div className="app-message">
          {message}
        </div>
      )}

      <section className="season-section">
        <div className="season-header">
          <div>
            <span className="season-label">
              Текущий сезон
            </span>

            <h2>
              {getSeasonLabel(currentSeason)}
            </h2>

            <p>
              {currentSeasonMedia.length === 0
                ? 'Для этого сезона пока ничего не добавлено'
                : `Подходит материалов: ${currentSeasonMedia.length}`}
            </p>
          </div>
        </div>
      </section>

      <section className="library-section">
        <div className="library-header">
          <div>
            <h2>Библиотека</h2>

            <p>
              {media.length === 0
                ? 'Здесь пока ничего нет'
                : `Всего: ${media.length}`}
            </p>
          </div>
        </div>

        <MediaList
          media={media}
          onUpdate={handleUpdateMedia}
          onDelete={handleDeleteMedia}
        />
      </section>
    </main>
  );
}