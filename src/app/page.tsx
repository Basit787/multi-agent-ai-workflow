"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const TOKEN_KEY = "workflow_token";

type Step = { agent: string; input: string; output: string };

const authSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const taskSchema = z.object({ task: z.string().min(3, "Describe your task") });

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authForm = useForm<z.infer<typeof authSchema>>({ resolver: zodResolver(authSchema), defaultValues: { email: "", password: "" } });
  const form = useForm<z.infer<typeof taskSchema>>({ resolver: zodResolver(taskSchema), defaultValues: { task: "" } });

  useEffect(() => { setAuthed(!!localStorage.getItem(TOKEN_KEY)); }, []);

  async function onAuth(values: z.infer<typeof authSchema>) {
    setError("");
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    localStorage.setItem(TOKEN_KEY, data.token);
    setAuthed(true);
  }

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    setLoading(true);
    setSteps([]);
    const res = await fetch("/api/workflow/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? "Workflow failed");
    else setSteps(data.steps ?? []);
    setLoading(false);
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-bold text-primary">Multi-Agent AI Workflow</h1>
        <form onSubmit={authForm.handleSubmit(onAuth)} className="space-y-3 rounded-xl border border-border bg-card p-6">
          <input {...authForm.register("email")} type="email" placeholder="Email" className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm" />
          <input {...authForm.register("password")} type="password" placeholder="Password" className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm" />
          <button type="submit" className="w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">{mode === "login" ? "Login" : "Register"}</button>
          <button type="button" className="text-xs text-muted-foreground" onClick={() => setMode(mode === "login" ? "register" : "login")}>Switch to {mode === "login" ? "register" : "login"}</button>
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Multi-Agent AI Workflow</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hono · JWT · RBAC · Drizzle · PostgreSQL</p>
        </div>
        <button type="button" className="text-sm text-muted-foreground" onClick={() => { localStorage.removeItem(TOKEN_KEY); setAuthed(false); }}>Logout</button>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <input {...form.register("task")} placeholder="Describe a task…" className={cn("flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm")} />
        <button type="submit" disabled={loading} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{loading ? "Running…" : "Run"}</button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <ol className="space-y-6">
        {steps.map((s, i) => (
          <li key={i} className="rounded-xl border border-border bg-card p-5 shadow">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{s.agent}</p>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">In: {s.input}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{s.output}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
