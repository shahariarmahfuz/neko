import "server-only";
import { createClient } from "@libsql/client";

// ✅ আপনার দেওয়া URL এখানে বসানো হলো
const TURSO_URL = "https://nemo-nekot.aws-ap-south-1.turso.io";

// ⚠️ Turso DB সাধারণত auth token চায়। আপনার টোকেন থাকলে এখানে বসান।
// যদি আপনার DB টোকেন ছাড়াই public করা থাকে (অস্বাভাবিক), তাহলে ফাঁকা রাখলেও চলতে পারে।
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxMjE4MzMsImlkIjoiZjYyZmM2YTMtNGYyOS00NjgyLThlZGYtYmRiZjJmODRjYzg3IiwicmlkIjoiYjA3NDdjODctYTBiMy00ZjA0LWE0MzMtMjIwNzI5M2NjOGY1In0.jgcHDhqH7_3JntpZinKdEAqkLpzk5xWFr87s6E4xLpSKLsEXZ4k0B4iFKJugB79RedLq43tFICjZy1BKL8B_Bg"; // e.g. "eyJhbGciOi..." (JWT)

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
