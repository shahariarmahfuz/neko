import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  const [mode, setMode] = useState("login");
  const [remember, setRemember] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState("");

  const canSubmit = useMemo(() => {
    if (mode === "signup") {
      return authName.trim() && authEmail.includes("@") && authPassword.length >= 4;
    }
    return authEmail.includes("@") && authPassword.length >= 4;
  }, [authEmail, authName, authPassword, mode]);

  useEffect(() => {
    const saved = window.localStorage.getItem("neko-session");
    if (!saved) return;
    try {
      const session = JSON.parse(saved);
      if (session?.email && session?.role) {
        setAuthEmail(session.email);
        setAuthRole(session.role);
      }
    } catch {
      window.localStorage.removeItem("neko-session");
    }
  }, []);

  function persistSession(email, role) {
    if (!remember) return;
    window.localStorage.setItem("neko-session", JSON.stringify({ email, role }));
  }

  function handleLogin(e) {
    e.preventDefault();
    const role =
      authEmail.trim().toLowerCase() === "admin@demo.com" && authPassword === "admin"
        ? "admin"
        : "user";
    setAuthRole(role);
    persistSession(authEmail.trim(), role);
  }

  function handleSignup(e) {
    e.preventDefault();
    setAuthRole("user");
    persistSession(authEmail.trim(), "user");
  }

  function handleLogout() {
    setAuthRole("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
    setRemember(false);
    window.localStorage.removeItem("neko-session");
  }

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
        <h1 style={{ margin: "8px 0 0" }}>Login & Signup</h1>
        <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
          ইমেইল দিয়ে লগইন করুন। রিমেম্বার মি অন থাকলে বার বার লগইন করতে হবে না।
        </p>
      </header>

      {authRole ? (
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 24,
            background: authRole === "admin" ? "#111827" : "#f8fafc",
            color: authRole === "admin" ? "#f9fafb" : "#111827"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            <div>
              <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
                {authRole === "admin" ? "Admin Panel" : "User Panel"}
              </p>
              <h2 style={{ margin: "8px 0" }}>
                {authRole === "admin" ? "Welcome, Admin" : "Welcome!"}
              </h2>
              <p style={{ margin: 0, color: authRole === "admin" ? "#9ca3af" : "#4b5563" }}>
                Signed in as <strong>{authEmail}</strong>
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                alignSelf: "flex-start",
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid",
                borderColor: authRole === "admin" ? "#374151" : "#cbd5f5",
                background: authRole === "admin" ? "#1f2937" : "#e2e8f0",
                color: authRole === "admin" ? "#f9fafb" : "#111827",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
            }}
          >
            <div style={{ padding: 16, borderRadius: 12, background: "#ffffff" }}>
              <h3 style={{ marginTop: 0 }}>Profile</h3>
              <p style={{ margin: 0, color: "#4b5563" }}>
                Manage account info, update your email, and secure your password.
              </p>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: "#ffffff" }}>
              <h3 style={{ marginTop: 0 }}>Notifications</h3>
              <p style={{ margin: 0, color: "#4b5563" }}>
                Choose which updates you want to receive in your inbox.
              </p>
            </div>
            {authRole === "admin" ? (
              <div style={{ padding: 16, borderRadius: 12, background: "#ffffff" }}>
                <h3 style={{ marginTop: 0 }}>Admin Tools</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#4b5563" }}>
                  <li>User management</li>
                  <li>Access control</li>
                  <li>System reports</li>
                </ul>
              </div>
            ) : (
              <div style={{ padding: 16, borderRadius: 12, background: "#ffffff" }}>
                <h3 style={{ marginTop: 0 }}>User Tools</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#4b5563" }}>
                  <li>View dashboard</li>
                  <li>Support requests</li>
                  <li>Activity history</li>
                </ul>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
          }}
        >
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 20
            }}
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <button
                onClick={() => setMode("login")}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #111827",
                  background: mode === "login" ? "#111827" : "#ffffff",
                  color: mode === "login" ? "#ffffff" : "#111827",
                  cursor: "pointer"
                }}
              >
                Login
              </button>
              <button
                onClick={() => setMode("signup")}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #111827",
                  background: mode === "signup" ? "#111827" : "#ffffff",
                  color: mode === "signup" ? "#ffffff" : "#111827",
                  cursor: "pointer"
                }}
              >
                Signup
              </button>
            </div>

            <form
              onSubmit={mode === "signup" ? handleSignup : handleLogin}
              style={{ display: "grid", gap: 12 }}
            >
              {mode === "signup" ? (
                <input
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Full name"
                  style={{ padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
                />
              ) : null}
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Email address"
                style={{ padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
              />
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Password"
                style={{ padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#4b5563" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #111827",
                  background: canSubmit ? "#111827" : "#9ca3af",
                  color: "white",
                  cursor: canSubmit ? "pointer" : "not-allowed"
                }}
              >
                {mode === "signup" ? "Create account" : "Login"}
              </button>
            </form>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 20,
              background: "#f8fafc"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Demo Credentials</h3>
            <p style={{ marginBottom: 8, color: "#4b5563" }}>
              Admin panel এর জন্য নিচের ইমেইল ব্যবহার করুন:
            </p>
            <div
              style={{
                background: "#ffffff",
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
            </div>
            <p style={{ marginTop: 16, color: "#4b5563" }}>
              User panel এ লগইন করতে চাইলে নিজের ইমেইল এবং পাসওয়ার্ড ব্যবহার করুন।
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
