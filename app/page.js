"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const canSubmit = useMemo(() => {
    const p = Number(price);
    return title.trim() && location.trim() && Number.isFinite(p) && p >= 0;
  }, [title, price, location]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/listings", { cache: "no-store" });
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function createListing(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        price: Number(price),
        location: location.trim()
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error || "Failed to create listing");
      return;
    }

    setTitle("");
    setPrice("");
    setLocation("");
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Buy/Sell Platform (Turso Mini)</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Endpoints: <code>/api/listings</code> (GET/POST), <code>/api/health</code>
      </p>

      <section style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Create Listing</h2>
        <form onSubmit={createListing} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            inputMode="decimal"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #222",
              background: canSubmit ? "#222" : "#777",
              color: "white",
              cursor: canSubmit ? "pointer" : "not-allowed"
            }}
          >
            Create
          </button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Latest Listings</h2>
        {loading ? (
          <p style={{ color: "#777" }}>Loading...</p>
        ) : listings.length === 0 ? (
          <p style={{ color: "#777" }}>No listings yet.</p>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {listings.map((x) => (
              <li key={x.id ?? `${x.title}-${x.created_at}`} style={{ marginBottom: 8 }}>
                <b>{x.title}</b> — {x.price} — {x.location}{" "}
                {x.created_at ? (
                  <span style={{ color: "#888" }}>
                    ({new Date(x.created_at).toLocaleString()})
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
          }
