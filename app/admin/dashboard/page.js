"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const stored =
      window.localStorage.getItem("neko-session") || window.sessionStorage.getItem("neko-session");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("neko-session");
        window.sessionStorage.removeItem("neko-session");
      }
    }
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Admin Dashboard</h1>
        <p style={{ margin: 0, color: "#4b5563" }}>
          এডমিনদের জন্য আলাদা ড্যাশবোর্ড এবং ম্যানেজমেন্ট টুলস।
        </p>
      </header>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          background: "#111827",
          color: "#f9fafb"
        }}
      >
        <h2 style={{ marginTop: 0 }}>Admin Session</h2>
        {session?.role === "admin" ? (
          <p style={{ margin: 0 }}>
            Signed in as <strong>{session.email}</strong>
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            কোনো এডমিন সেশন পাওয়া যায়নি। <Link href="/admin/login">Admin login</Link> করুন।
          </p>
        )}
      </section>

      <section
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        {["User Management", "Access Control", "Reports"].map((item) => (
          <div
            key={item}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 16,
              background: "#f8fafc"
            }}
          >
            <h3 style={{ marginTop: 0 }}>{item}</h3>
            <p style={{ marginBottom: 0, color: "#4b5563" }}>
              {item} সেটিংস এখানে থাকবে।
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
