import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui",
        padding: 24,
        maxWidth: 960,
        margin: "0 auto"
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, color: "#6b7280" }}>Smart Access Portal</p>
        <h1 style={{ margin: "8px 0 0" }}>Authentication Pages</h1>
        <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
          এখানে লগইন, সাইনআপ এবং ড্যাশবোর্ডের আলাদা আলাদা পেইজ আছে।
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        {[
          { href: "/login", title: "User Login", desc: "ইমেইল দিয়ে লগইন করুন।" },
          { href: "/signup", title: "User Signup", desc: "নতুন অ্যাকাউন্ট তৈরি করুন।" },
          { href: "/dashboard", title: "User Dashboard", desc: "ইউজার ড্যাশবোর্ড ভিউ।" },
          { href: "/admin/login", title: "Admin Login", desc: "এডমিন লগইন পেইজ।" },
          {
            href: "/admin/dashboard",
            title: "Admin Dashboard",
            desc: "এডমিন ড্যাশবোর্ড ভিউ।"
          }
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 16,
              background: "#f9fafb"
            }}
          >
            <h2 style={{ marginTop: 0 }}>{item.title}</h2>
            <p style={{ marginBottom: 0, color: "#4b5563" }}>{item.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
