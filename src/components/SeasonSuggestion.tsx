import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import PosterPreview from './PosterPreview';

import type {
  MediaRecord,
  Season,
} from '../types/media';

import { getSeasonLabel } from '../utils/season';

interface SeasonSuggestionProps {
  media: MediaRecord[];
  season: Season;
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

export default function SeasonSuggestion({
  media,
  season,
}: SeasonSuggestionProps) {
  const [suggestedMedia, setSuggestedMedia] =
    useState<MediaRecord | null>(null);

  const chooseRandomMedia = useCallback(() => {
    if (media.length === 0) {
      setSuggestedMedia(null);
      return;
    }

    if (media.length === 1) {
      setSuggestedMedia(media[0]);
      return;
    }

    const availableMedia = suggestedMedia
      ? media.filter(
          (item) => item.id !== suggestedMedia.id,
        )
      : media;

    const randomIndex = Math.floor(
      Math.random() * availableMedia.length,
    );

    setSuggestedMedia(
      availableMedia[randomIndex],
    );
  }, [media, suggestedMedia]);

  useEffect(() => {
    if (media.length === 0) {
      setSuggestedMedia(null);
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * media.length,
    );

    setSuggestedMedia(media[randomIndex]);
  }, [media, season]);

  const handleOpenFile = async () => {
    if (!suggestedMedia?.file_path) {
      return;
    }

    const opened =
      await window.electronAPI.openMediaFile(
        suggestedMedia.file_path,
      );

    if (!opened) {
      console.error(
        'Failed to open suggested media',
      );
    }
  };

  if (!suggestedMedia) {
    return (
      <div className="season-suggestion season-suggestion-empty">
        <span>Что выбрать сегодня?</span>

        <p>
          Для сезона «{getSeasonLabel(season)}»
          пока нечего предложить.
        </p>
      </div>
    );
  }

  return (
    <section className="season-suggestion">
      <div className="season-suggestion-poster">
        {suggestedMedia.poster_path ? (
          <PosterPreview
            posterPath={
              suggestedMedia.poster_path
            }
            alt={suggestedMedia.title}
          />
        ) : (
          <div className="media-poster-placeholder">
            Нет постера
          </div>
        )}
      </div>

      <div className="season-suggestion-content">
        <span className="season-suggestion-label">
          Что выбрать сегодня?
        </span>

        <h3>
          {suggestedMedia.title}
        </h3>

        <div className="season-suggestion-meta">
          <span>
            {getTypeLabel(
              suggestedMedia.type,
            )}
          </span>

          {suggestedMedia.year !== null && (
            <>
              <span>•</span>
              <span>
                {suggestedMedia.year}
              </span>
            </>
          )}
        </div>

        {suggestedMedia.description && (
          <p className="season-suggestion-description">
            {suggestedMedia.description}
          </p>
        )}

        <div className="season-suggestion-actions">
          {suggestedMedia.file_path && (
            <button
              type="button"
              onClick={handleOpenFile}
            >
              Открыть
            </button>
          )}

          <button
            type="button"
            onClick={chooseRandomMedia}
          >
            Другой вариант
          </button>
        </div>
      </div>
    </section>
  );
}