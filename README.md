# Multi-Agent AI Workflow

Orchestrates **Planner → Researcher → Writer** agents with **Next.js**, **Drizzle**, **PostgreSQL**, **shadcn-style UI**, and **React Hook Form**. Calls **Ollama** when available.

## Docker (production)

```bash
cp .env.example .env
docker compose up --build
```

- App: http://localhost:3006  
- Requires Ollama: `OLLAMA_URL=http://host.docker.internal:11434`

## Local dev

```bash
docker compose up postgres -d
cp .env.example .env
npm install
npm run db:push
npm run dev
```

MIT
