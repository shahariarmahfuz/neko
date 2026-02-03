import { ensureAuthSchema, db } from "../../_db/libsql";

export const runtime = "nodejs";

export async function POST(request) {
  await ensureAuthSchema();
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return Response.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  if (!email.includes("@")) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    await db.execute({
      sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      args: [name, email, password]
    });
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("unique")) {
      return Response.json({ error: "Email already exists." }, { status: 409 });
    }
    return Response.json({ error: "Failed to create user." }, { status: 500 });
  }

  return Response.json({ ok: true, role: "user", email });
}
