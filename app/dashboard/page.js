"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
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
        <h1 style={{ marginBottom: 8 }}>User Dashboard</h1>
        <p style={{ margin: 0, color: "#4b5563" }}>
          ইউজারদের জন্য আলাদা ড্যাশবোর্ড ভিউ।
        </p>
      </header>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20
        }}
      >
        <h2 style={{ marginTop: 0 }}>Session Info</h2>
        {session ? (
          <p style={{ margin: 0, color: "#4b5563" }}>
            Signed in as <strong>{session.email}</strong>
          </p>
        ) : (
          <p style={{ margin: 0, color: "#4b5563" }}>
            কোনো সেশন পাওয়া যায়নি। লগইন করতে <Link href="/login">Login</Link> এ যান।
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
        {["Profile", "Orders", "Support"].map((item) => (
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
              {item} এর জন্য আলাদা কন্টেন্ট এখানে থাকবে।
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
