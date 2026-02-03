import { ensureAuthSchema, db } from "../../_db/libsql";

export async function POST(request) {
  await ensureAuthSchema();
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (email === "admin@demo.com" && password === "admin") {
    await db.execute({
      sql: `
        INSERT INTO users (name, email, password, role, last_login)
        VALUES (?, ?, ?, 'admin', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        ON CONFLICT(email) DO UPDATE SET last_login=excluded.last_login, role='admin'
      `,
      args: ["Admin", email, password]
    });
    return Response.json({ ok: true, role: "admin", email });
  }

  const result = await db.execute({
    sql: "SELECT id, email, role FROM users WHERE email = ? AND password = ? LIMIT 1",
    args: [email, password]
  });
  const row = result.rows?.[0];

  if (!row) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await db.execute({
    sql: "UPDATE users SET last_login = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    args: [row.id]
  });

  return Response.json({ ok: true, role: row.role || "user", email: row.email });
}
