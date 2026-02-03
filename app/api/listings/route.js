export const runtime = "nodejs";

import { db, ensureSchema } from "../_db/libsql.js";

export async function GET() {
  await ensureSchema();

  const result = await db.execute({
    sql: `
      SELECT id, title, price, location, created_at
      FROM listings
      ORDER BY datetime(created_at) DESC
      LIMIT 50
    `,
    args: []
  });

  // libsql rows object -> plain array
  const rows = result.rows?.map((r) => ({
    id: Number(r.id),
    title: String(r.title),
    price: Number(r.price),
    location: String(r.location),
    created_at: String(r.created_at)
  })) ?? [];

  return Response.json(rows);
}

export async function POST(req) {
  await ensureSchema();

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body?.title ?? "").trim();
  const location = String(body?.location ?? "").trim();
  const price = Number(body?.price);

  if (!title || !location || !Number.isFinite(price) || price < 0) {
    return Response.json(
      {
        error:
          "Validation failed. Required: title (string), location (string), price (number >= 0)"
      },
      { status: 400 }
    );
  }

  const inserted = await db.execute({
    sql: `
      INSERT INTO listings (title, price, location)
      VALUES (?, ?, ?)
    `,
    args: [title, price, location]
  });

  // lastInsertRowid is available in some drivers; if missing, we just return OK
  const id = inserted.lastInsertRowid ? Number(inserted.lastInsertRowid) : null;

  return Response.json(
    {
      ok: true,
      id,
      title,
      price,
      location
    },
    { status: 201 }
  );
}
