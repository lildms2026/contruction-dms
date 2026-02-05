"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setMsg(null);

    try {
      const supabase = supabaseBrowser();

      const { error } =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) {
        setMsg(error.message);
        return;
      }

      // If email confirmations are enabled in Supabase, signup may require email click.
      setMsg(mode === "signup" ? "Account created. Check your email if confirmation is enabled." : "Logged in!");
      router.push("/app");
    } catch (e: any) {
      setMsg(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        {mode === "login" ? "Log in" : "Sign up"}
      </h1>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 14, opacity: 0.8 }}>Email</span>
          <input
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 14, opacity: 0.8 }}>Password</span>
          <input
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #111",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>

        {msg && <p style={{ marginTop: 6 }}>{msg}</p>}
      </div>
    </main>
  );
}
