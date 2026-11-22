import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import MediaForm from './components/MediaForm';
import MediaList from './components/MediaList';
import SeasonHero from './components/SeasonHero';
import SeasonPlans from './components/SeasonPlans';
import SeasonSelector from './components/SeasonSelector';
import SeasonSuggestion from './components/SeasonSuggestion';

import {
  getCurrentSeason,
  getSeasonLabel,
} from './utils/season';

import type {
  CreateMediaInput,
  MediaRecord,
  Season,
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

  const [selectedSeason, setSelectedSeason] =
    useState<Season>(currentSeason);

  const selectedSeasonMedia = media.filter(
    (item) =>
      item.seasons.includes(selectedSeason),
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
    <main
      className="app"
      data-season={selectedSeason}
    >
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
        <SeasonHero
          season={selectedSeason}
          mediaCount={selectedSeasonMedia.length}
          isCurrentSeason={
            selectedSeason === currentSeason
          }
        />

        <SeasonSelector
          selectedSeason={selectedSeason}
          onSelect={setSelectedSeason}
        />

        <SeasonSuggestion
          media={selectedSeasonMedia}
          season={selectedSeason}
        />

        <SeasonPlans
          key={selectedSeason}
          season={selectedSeason}
          media={selectedSeasonMedia}
        />

        <div className="season-media-section">
          <div className="season-media-header">
            <div>
              <span className="season-media-label">
                Подборка сезона
              </span>

              <h2>
                {getSeasonLabel(selectedSeason)}
              </h2>
            </div>

            <span className="season-media-count">
              {selectedSeasonMedia.length}
            </span>
          </div>

          <MediaList
            media={selectedSeasonMedia}
            onUpdate={handleUpdateMedia}
            onDelete={handleDeleteMedia}
            emptyMessage="Для этого сезона пока ничего не добавлено."
          />
        </div>
      </section>

      <section className="library-section">
        <div className="library-header">
          <div>
            <h2>Вся библиотека</h2>

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