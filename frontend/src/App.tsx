import { FormEvent, useState } from "react";

type Step = { agent: string; input: string; output: string };

export default function App() {
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  async function run(e: FormEvent) {
    e.preventDefault();
    if (!task.trim()) return;
    setLoading(true);
    setSteps([]);
    const res = await fetch("/api/workflow/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    });
    const data = await res.json();
    setSteps(data.steps ?? []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-teal-400">Multi-Agent AI Workflow</h1>
      <p className="mt-1 text-sm text-slate-400">Planner → Researcher → Writer (Ollama or simulated)</p>
      <form onSubmit={run} className="mt-6 flex gap-2">
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Describe a task…" className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm" />
        <button disabled={loading} className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold disabled:opacity-50">{loading ? "Running…" : "Run"}</button>
      </form>
      <ol className="mt-8 space-y-6">
        {steps.map((s, i) => (
          <li key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400">{s.agent}</p>
            <p className="mt-3 text-sm text-slate-400 line-clamp-2">In: {s.input}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">{s.output}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
