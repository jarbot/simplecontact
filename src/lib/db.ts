import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use /tmp for Vercel serverless functions, or local data folder for development
const getDbPath = () => {
  if (process.env.VERCEL) {
    return '/tmp/contacts.db';
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'contacts.db');
};

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = getDbPath();
    db = new Database(dbPath);
    initializeDb(db);
  }
  return db;
}

function initializeDb(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT
    )
  `);
}

export interface ContactSubmission {
  name: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
}

export function saveContact(submission: ContactSubmission): { id: number } {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, ip_address, user_agent)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(
    submission.name,
    submission.email,
    submission.ipAddress || null,
    submission.userAgent || null
  );
  return { id: result.lastInsertRowid as number };
}

export function getContacts(): Array<{
  id: number;
  name: string;
  email: string;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}> {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC');
  return stmt.all() as Array<{
    id: number;
    name: string;
    email: string;
    created_at: string;
    ip_address: string | null;
    user_agent: string | null;
  }>;
}
