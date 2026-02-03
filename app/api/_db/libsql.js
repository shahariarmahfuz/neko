import "server-only";
import { createClient } from "@libsql/client";

// ✅ আপনার দেওয়া URL এখানে বসানো হলো
const TURSO_URL = "https://nila-nekot.aws-ap-south-1.turso.io";

// ⚠️ Turso DB সাধারণত auth token চায়। আপনার টোকেন থাকলে এখানে বসান।
// যদি আপনার DB টোকেন ছাড়াই public করা থাকে (অস্বাভাবিক), তাহলে ফাঁকা রাখলেও চলতে পারে।
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxMjA4MTgsImlkIjoiOTZkYzQ4MGQtZGY1NS00OWU2LWE5YTgtNGM2MWNkNDFmMzQyIiwicmlkIjoiZDM3NjhhNDQtNGJmOC00ZTAxLWI4NDItOGM4MGFiMDE5MDFlIn0.c95wqrOExBFxW8KyYvGrXgMi5BGirkRemkXYyMyGz7ou1LfrARz9xZpPJZC7X2nNj_Zp36RKvVN2g8HFVH2BBw"; // e.g. "eyJhbGciOi..." (JWT)

/**
 * IMPORTANT:
 * - এই ফাইলটা শুধুই server-side এ লোড হবে (server-only).
 * - টোকেন কখনোই client component এ ব্যবহার করবেন না।
 */
export const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN || undefined
});

/**
 * Minimal schema
 */
export async function ensureSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      location TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);
}

export async function ensureAuthSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      last_login TEXT
    );
  `);
}
