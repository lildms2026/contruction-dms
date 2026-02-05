"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Project = { id: string; name: string; created_at: string };

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");

  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
  }

  async function addProject() {
    if (!name) return;
    await supabase.from("projects").insert({ name });
    setName("");
    loadProjects();
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Construction DMS</h1>

      <div style={{ marginTop: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
        />
        <button onClick={addProject}>Add</button>
      </div>

      <ul style={{ marginTop: 20 }}>
        {projects.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </main>
  );
}
