import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import type {
  CreateMediaInput,
  MediaRecord,
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

  database.pragma('journal_mode = WAL');

  initializeSchema(database);
}

function getDatabase(): Database.Database {
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
      file_path
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    media.title,
    media.type,
    media.year,
    media.description,
    media.filePath,
  );

  return Number(result.lastInsertRowid);
}

export function getMedia(): MediaRecord[] {
  const db = getDatabase();

  const statement = db.prepare(`
    SELECT
      id,
      title,
      type,
      file_path,
      poster_path,
      year,
      duration_minutes,
      description,
      created_at
    FROM media
    ORDER BY id
  `);

  return statement.all() as MediaRecord[];
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
      file_path = ?
    WHERE id = ?
  `);

  const result = statement.run(
    media.title,
    media.type,
    media.year,
    media.description,
    media.filePath,
    media.id,
  );

  return result.changes > 0;
}