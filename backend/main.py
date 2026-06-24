import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Multi-Agent AI Workflow")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA = "http://127.0.0.1:11434"
MODEL = "llama3.2"


class TaskRequest(BaseModel):
    task: str


class Step(BaseModel):
    agent: str
    input: str
    output: str


class WorkflowResponse(BaseModel):
    task: str
    steps: list[Step]


async def ollama_chat(prompt: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            r = await client.post(
                f"{OLLAMA}/api/chat",
                json={
                    "model": MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": False,
                },
            )
            if r.status_code == 200:
                return r.json()["message"]["content"]
    except Exception:
        pass
    return f"[Simulated] Processed: {prompt[:120]}…"


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/workflow/run", response_model=WorkflowResponse)
async def run_workflow(body: TaskRequest):
    task = body.task.strip()
    steps: list[Step] = []

    plan_prompt = f"You are a Planner agent. Break this task into 3 concrete steps:\n{task}"
    plan = await ollama_chat(plan_prompt)
    steps.append(Step(agent="Planner", input=task, output=plan))

    research_prompt = f"You are a Researcher agent. Given the plan below, list key facts and tools needed:\n{plan}"
    research = await ollama_chat(research_prompt)
    steps.append(Step(agent="Researcher", input=plan[:500], output=research))

    writer_prompt = f"You are a Writer agent. Produce a final deliverable for the task using this research:\nTask: {task}\nResearch: {research}"
    final = await ollama_chat(writer_prompt)
    steps.append(Step(agent="Writer", input=research[:500], output=final))

    return WorkflowResponse(task=task, steps=steps)
