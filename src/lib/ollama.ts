const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export async function ollamaChat(prompt: string): Promise<string> {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      }),
    });
    if (r.ok) {
      const json = await r.json();
      return json.message?.content ?? "";
    }
  } catch {
    /* fallback */
  }
  return `[Simulated] Processed: ${prompt.slice(0, 120)}…`;
}
