"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return email.includes("@") && password.length >= 4;
  }, [email, password]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "Login failed.");
        return;
      }
      if (data.role !== "admin") {
        setError("শুধুমাত্র এডমিন লগইন করা যাবে।");
        return;
      }
      const session = { email: data.email || email.trim(), role: "admin" };
      if (remember) {
        window.localStorage.setItem("neko-session", JSON.stringify(session));
      } else {
        window.sessionStorage.setItem("neko-session", JSON.stringify(session));
      }
      router.push("/admin/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Admin Login</h1>
        <p style={{ margin: 0, color: "#4b5563" }}>
          এডমিন লগইন করার জন্য ডেমো ক্রেডেনশিয়াল ব্যবহার করুন।
        </p>
      </header>

      <section style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            style={{ padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
          />
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            placeholder="Password"
            style={{ padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
          />
          {error ? <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p> : null}
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#4b5563" }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            Remember me
          </label>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid #111827",
              background: canSubmit && !isSubmitting ? "#111827" : "#9ca3af",
              color: "white",
              cursor: canSubmit && !isSubmitting ? "pointer" : "not-allowed"
            }}
          >
            {isSubmitting ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </section>

      <section
        style={{
          marginTop: 16,
          background: "#f8fafc",
          borderRadius: 12,
          padding: 12,
          border: "1px dashed #cbd5f5"
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Email:</strong> admin@demo.com
        </p>
        <p style={{ margin: "6px 0 0" }}>
          <strong>Password:</strong> admin
        </p>
      </section>

      <footer style={{ marginTop: 16, color: "#4b5563" }}>
        ইউজার লগইন? <Link href="/login">User Login</Link>
      </footer>
    </main>
  );
}
