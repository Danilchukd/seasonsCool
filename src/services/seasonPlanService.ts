import { getDatabase } from './databaseService';
import type { Season } from '../types/media';
import type {
  CreateSeasonPlanInput,
  SeasonPlan,
  UpdateSeasonPlanInput,
} from '../types/seasonPlan';

interface SeasonPlanRow {
  id: number;
  season: Season;
  season_year: number;
  title: string;
  is_completed: number;
  media_id: number | null;
  created_at: string;
}

export function getSeasonPlans(season: Season, seasonYear: number): SeasonPlan[] {
  const rows = getDatabase().prepare(`
    SELECT
      id, season, season_year, title, is_completed, media_id, created_at
    FROM season_plans
    WHERE season = ? AND season_year = ?
    ORDER BY is_completed ASC, id ASC
  `).all(season, seasonYear) as SeasonPlanRow[];

  return rows.map((row) => ({
    id: row.id,
    season: row.season,
    seasonYear: row.season_year,
    title: row.title,
    completed: row.is_completed === 1,
    mediaId: row.media_id,
    createdAt: row.created_at,
  }));
}

export function createSeasonPlan(input: CreateSeasonPlanInput): number {
  const result = getDatabase().prepare(`
    INSERT INTO season_plans (season, season_year, title, media_id)
    VALUES (?, ?, ?, ?)
  `).run(input.season, input.seasonYear, input.title, input.mediaId);

  return Number(result.lastInsertRowid);
}

export function updateSeasonPlan(input: UpdateSeasonPlanInput): boolean {
  const result = getDatabase().prepare(`
    UPDATE season_plans
    SET title = ?, is_completed = ?
    WHERE id = ?
  `).run(input.title, input.completed ? 1 : 0, input.id);

  return result.changes > 0;
}

export function deleteSeasonPlan(id: number): boolean {
  return getDatabase().prepare(`
    DELETE FROM season_plans WHERE id = ?
  `).run(id).changes > 0;
}
