"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

export default function AppPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        // If something is wrong with auth/session, send user to login
        router.push("/login");
        return;
      }

      if (!data.user) {
        router.push("/login");
        return;
      }

      setEmail(data.user.email ?? null);
      setLoading(false);
    });
  }, [router]);

  async function logout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Dashboard</h1>

      {loading ? (
        <p style={{ marginTop: 8 }}>Checking session…</p>
      ) : (
        <p style={{ marginTop: 8 }}>Logged in as: {email ?? "Unknown"}</p>
      )}

      <button
        onClick={logout}
        style={{ marginTop: 16, padding: 10, borderRadius: 8, border: "1px solid #111" }}
      >
        Log out
      </button>

      <p style={{ marginTop: 24, opacity: 0.7 }}>
        Next: create Company + link Projects to Company + turn on RLS.
      </p>
    </main>
  );
}
