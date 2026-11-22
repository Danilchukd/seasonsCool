import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import type {
  CreateMediaInput,
  MediaRecord,
  Season,
  UpdateMediaInput,
} from '../types/media';

let database: Database.Database | null = null;

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      file_path TEXT,
      poster_path TEXT,
      year INTEGER,
      duration_minutes INTEGER,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS media_seasons (
      media_id INTEGER NOT NULL,
      season TEXT NOT NULL,
      PRIMARY KEY (media_id, season),
      FOREIGN KEY (media_id)
        REFERENCES media(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS season_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season TEXT NOT NULL CHECK (season IN ('winter', 'spring', 'summer', 'autumn')),
      season_year INTEGER NOT NULL CHECK (season_year BETWEEN 1 AND 9998),
      title TEXT NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0 CHECK (is_completed IN (0, 1)),
      media_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_season_plans_season_year
      ON season_plans (season, season_year);
  `);
}

export function initializeDatabase(): void {
  if (database) {
    return;
  }

  const databasePath = path.join(
    app.getPath('userData'),
    'seasonscool.db',
  );

  console.log('Database path:', databasePath);

  database = new Database(databasePath);

  database.pragma('foreign_keys = ON');
  database.pragma('journal_mode = WAL');

  initializeSchema(database);
}

export function getDatabase(): Database.Database {
  if (!database) {
    throw new Error('Database has not been initialized');
  }

  return database;
}

export function closeDatabase(): void {
  if (!database) {
    return;
  }

  database.close();
  database = null;
}

export function addMedia(
  media: CreateMediaInput,
): number {
  const db = getDatabase();

  const statement = db.prepare(`
    INSERT INTO media (
      title,
      type,
      year,
      description,
      file_path,
      poster_path
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    media.title,
    media.type,
    media.year,
    media.description,
    media.filePath,
    media.posterPath,
  );

  const mediaId = Number(result.lastInsertRowid);

  saveMediaSeasons(
    db,
    mediaId,
    media.seasons,
  );

  return mediaId;
}

export function getMedia(): MediaRecord[] {
  
  interface MediaDatabaseRow {
  id: number;
  title: string;
  type: string;
  file_path: string | null;
  poster_path: string | null;
  year: number | null;
  duration_minutes: number | null;
  description: string | null;
  created_at: string;
  seasons: string | null;
}


  const db = getDatabase();

  const statement = db.prepare(`
    SELECT
      m.id,
      m.title,
      m.type,
      m.file_path,
      m.poster_path,
      m.year,
      m.duration_minutes,
      m.description,
      m.created_at,
      GROUP_CONCAT(ms.season) AS seasons
    FROM media m
    LEFT JOIN media_seasons ms
      ON ms.media_id = m.id
    GROUP BY m.id
    ORDER BY m.id
  `);

  const rows =
    statement.all() as MediaDatabaseRow[];

  return rows.map((row) => ({
    ...row,
    seasons: row.seasons
      ? row.seasons.split(',') as Season[]
      : [],
  }));
}

export function deleteMedia(id: number): boolean {
  const db = getDatabase();

  const statement = db.prepare(`
    DELETE FROM media
    WHERE id = ?
  `);

  const result = statement.run(id);

  return result.changes > 0;
}

export function updateMedia(
  media: UpdateMediaInput,
): boolean {
  const db = getDatabase();

  const statement = db.prepare(`
    UPDATE media
    SET
      title = ?,
      type = ?,
      year = ?,
      description = ?,
      file_path = ?,
      poster_path = ?
    WHERE id = ?
  `);

  const result = statement.run(
    media.title,
    media.type,
    media.year,
    media.description,
    media.filePath,
    media.posterPath,
    media.id,
  );

  if (result.changes > 0) {
    saveMediaSeasons(
      db,
      media.id,
      media.seasons,
    );
  }

  return result.changes > 0;
}

function saveMediaSeasons(
  db: Database.Database,
  mediaId: number,
  seasons: Season[],
) {
  const deleteStatement = db.prepare(`
    DELETE FROM media_seasons
    WHERE media_id = ?
  `);

  const insertStatement = db.prepare(`
    INSERT INTO media_seasons (
      media_id,
      season
    )
    VALUES (?, ?)
  `);

  deleteStatement.run(mediaId);

  for (const season of seasons) {
    insertStatement.run(mediaId, season);
  }
}