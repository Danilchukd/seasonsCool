import { SEASON_CONFIG } from '../config/seasons';

import type { Season } from '../types/media';

interface SeasonHeroProps {
  season: Season;
  mediaCount: number;
  isCurrentSeason: boolean;
}

export default function SeasonHero({
  season,
  mediaCount,
  isCurrentSeason,
}: SeasonHeroProps) {
  const config = SEASON_CONFIG[season];

  return (
    <div
      className="season-hero"
      data-season={season}
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(10, 10, 10, 0.92) 0%,
            rgba(10, 10, 10, 0.72) 45%,
            rgba(10, 10, 10, 0.28) 100%
          ),
          url(${config.background})
        `,
      }}
    >
      <div className="season-hero-content">
        <div className="season-hero-top">
          <span className="season-hero-eyebrow">
            {config.eyebrow}
          </span>

          {isCurrentSeason && (
            <span className="season-hero-current">
              Сейчас
            </span>
          )}
        </div>

        <h2 className="season-hero-title">
          {config.title}
        </h2>

        <p className="season-hero-description">
          {config.subtitle}
        </p>

        <div className="season-hero-meta">
          {mediaCount === 0
            ? 'Пока нет материалов'
            : `Материалов: ${mediaCount}`}
        </div>
      </div>
    </div>
  );
}