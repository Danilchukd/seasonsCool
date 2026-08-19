import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

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

export function getDatabase(): Database.Database {
  if (database) {
    return database;
  }

  const databasePath = path.join(
    app.getPath('userData'),
    'seasonscool.db',
  );

  console.log('Database path:', databasePath);

  database = new Database(databasePath);

  database.pragma('journal_mode = WAL');

  initializeSchema(database);

  return database;
}

export function addMedia(
  title: string,
  type: string,
): number {
  const db = getDatabase();

  const statement = db.prepare(`
    INSERT INTO media (
      title,
      type
    )
    VALUES (?, ?)
  `);

  const result = statement.run(title, type);

  return Number(result.lastInsertRowid);
}

export interface MediaRecord {
  id: number;
  title: string;
  type: string;
  file_path: string | null;
  poster_path: string | null;
  year: number | null;
  duration_minutes: number | null;
  description: string | null;
  created_at: string;
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
  id: number,
  title: string,
  type: string,
): boolean {
  const db = getDatabase();

  const statement = db.prepare(`
    UPDATE media
    SET
      title = ?,
      type = ?
    WHERE id = ?
  `);

  const result = statement.run(title, type, id);

  return result.changes > 0;
}