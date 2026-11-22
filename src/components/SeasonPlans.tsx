import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { MediaRecord, Season } from '../types/media';
import type { SeasonPlan } from '../types/seasonPlan';
import { getSeasonLabel } from '../utils/season';

interface SeasonPlansProps {
  season: Season;
  media: MediaRecord[];
}

function getDefaultSeasonYear(season: Season): number {
  const now = new Date();
  const year = now.getFullYear();

  // January and February belong to the winter that began last December.
  if (season === 'winter' && now.getMonth() <= 1) {
    return year - 1;
  }

  return year;
}

function formatSeasonYear(season: Season, year: number): string {
  return season === 'winter'
    ? getSeasonLabel(season) + ' ' + year + '/' + String(year + 1).slice(-2)
    : getSeasonLabel(season) + ' ' + year;
}

export default function SeasonPlans({ season, media }: SeasonPlansProps) {
  const [seasonYear, setSeasonYear] = useState(() => getDefaultSeasonYear(season));
  const [plans, setPlans] = useState<SeasonPlan[]>([]);
  const [title, setTitle] = useState('');
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);
    setPlans([]);

    window.electronAPI.getSeasonPlans({ season, seasonYear })
      .then((result) => {
        if (active) {
          setPlans(result);
        }
      })
      .catch((reason: unknown) => {
        console.error('Failed to load season plans', reason);
        if (active) {
          setError('Не удалось загрузить планы.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [season, seasonYear, reloadKey]);

  const refresh = () => setReloadKey((key) => key + 1);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const planTitle = title.trim();
    if (!planTitle || busy) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await window.electronAPI.createSeasonPlan({
        season,
        seasonYear,
        title: planTitle,
        mediaId,
      });

      setTitle('');
      setMediaId(null);
      refresh();
    } catch (reason) {
      console.error('Failed to create season plan', reason);
      setError('Не удалось добавить план.');
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (plan: SeasonPlan) => {
    if (busy) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await window.electronAPI.updateSeasonPlan({
        id: plan.id,
        title: plan.title,
        completed: !plan.completed,
      });

      refresh();
    } catch (reason) {
      console.error('Failed to update season plan', reason);
      setError('Не удалось изменить статус плана.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async (
    event: FormEvent<HTMLFormElement>,
    plan: SeasonPlan,
  ) => {
    event.preventDefault();

    if (!editTitle.trim() || busy) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await window.electronAPI.updateSeasonPlan({
        id: plan.id,
        title: editTitle.trim(),
        completed: plan.completed,
      });

      setEditingId(null);
      setEditTitle('');
      refresh();
    } catch (reason) {
      console.error('Failed to rename season plan', reason);
      setError('Не удалось сохранить название.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (plan: SeasonPlan) => {
    if (busy || !window.confirm('Удалить план «' + plan.title + '»?')) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await window.electronAPI.deleteSeasonPlan(plan.id);
      if (editingId === plan.id) {
        setEditingId(null);
      }
      refresh();
    } catch (reason) {
      console.error('Failed to delete season plan', reason);
      setError('Не удалось удалить план.');
    } finally {
      setBusy(false);
    }
  };

  const completedCount = plans.filter((plan) => plan.completed).length;

  return (
    <section className="season-plans">
      <div className="season-plans-header">
        <div>
          <span className="season-media-label">Планы на сезон</span>
          <h2>{formatSeasonYear(season, seasonYear)}</h2>
          <p>Разовые планы для этого сезона и года.</p>
        </div>

        <div className="season-plans-year-controls">
          <button
            type="button"
            aria-label="Предыдущий год"
            onClick={() => setSeasonYear((year) => year - 1)}
            disabled={busy || seasonYear <= 1}
          >
            ←
          </button>
          <span>{seasonYear}{season === 'winter' ? '/' + String(seasonYear + 1).slice(-2) : ''}</span>
          <button
            type="button"
            aria-label="Следующий год"
            onClick={() => setSeasonYear((year) => year + 1)}
            disabled={busy || seasonYear >= 9998}
          >
            →
          </button>
        </div>
      </div>

      <form className="season-plans-add" onSubmit={handleAdd}>
        <input
          type="text"
          value={title}
          maxLength={200}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Например, перепройти Max Payne"
          aria-label="Новый план"
          disabled={busy}
          required
        />

        <select
          value={mediaId === null ? '' : String(mediaId)}
          onChange={(event) => {
            const id = event.target.value ? Number(event.target.value) : null;
            setMediaId(id);
            if (id !== null && !title.trim()) {
              const selected = media.find((item) => item.id === id);
              if (selected) {
                setTitle(selected.title);
              }
            }
          }}
          aria-label="Связанный материал"
          disabled={busy}
        >
          <option value="">Без связи с медиатекой</option>
          {media.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>

        <button type="submit" disabled={busy || !title.trim()}>
          Добавить план
        </button>
      </form>

      {error && <p className="season-plans-error" role="alert">{error}</p>}

      {!loading && plans.length > 0 && (
        <div className="season-plans-progress">
          Выполнено {completedCount} из {plans.length}
          <div className="season-plans-progress-track">
            <div
              className="season-plans-progress-fill"
              style={{ width: (completedCount / plans.length) * 100 + '%' }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="season-plans-empty">Загружаем планы…</p>
      ) : plans.length === 0 ? (
        <p className="season-plans-empty">Планов пока нет. Добавь первый.</p>
      ) : (
        <ul className="season-plans-list">
          {plans.map((plan) => (
            <li key={plan.id} className={plan.completed ? 'completed' : ''}>
              {editingId === plan.id ? (
                <form
                  className="season-plans-edit"
                  onSubmit={(event) => handleSaveEdit(event, plan)}
                >
                  <input
                    autoFocus
                    type="text"
                    value={editTitle}
                    maxLength={200}
                    onChange={(event) => setEditTitle(event.target.value)}
                    disabled={busy}
                    required
                  />
                  <button type="submit" disabled={busy || !editTitle.trim()}>
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    disabled={busy}
                  >
                    Отмена
                  </button>
                </form>
              ) : (
                <>
                  <label className="season-plans-item-title">
                    <input
                      type="checkbox"
                      checked={plan.completed}
                      onChange={() => void handleToggle(plan)}
                      disabled={busy}
                    />
                    <span>{plan.title}</span>
                  </label>
                  <div className="season-plans-item-actions">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setEditingId(plan.id);
                        setEditTitle(plan.title);
                      }}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleDelete(plan)}
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
