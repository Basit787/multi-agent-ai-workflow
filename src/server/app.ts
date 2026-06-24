import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users, workflowSteps, workflows } from "@/db/schema";
import { ollamaChat } from "@/lib/ollama";
import { hashPassword, signToken, verifyPassword } from "./auth";
import { authenticate, onError, requireRole, validateJson, type AppVariables } from "./middleware";

const app = new Hono<{ Variables: AppVariables }>().basePath("/api");

app.use("*", secureHeaders());
app.onError(onError);

const registerSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const runSchema = z.object({ task: z.string().min(3).max(4000) });

app.post("/auth/register", validateJson(registerSchema), async (c) => {
  const body = c.get("validatedBody") as z.infer<typeof registerSchema>;
  if (await db.query.users.findFirst({ where: eq(users.email, body.email) })) {
    return c.json({ error: "Email already registered" }, 409);
  }
  const [user] = await db.insert(users).values({ email: body.email, password: await hashPassword(body.password), role: "user" }).returning();
  return c.json({ token: await signToken(user), user: { id: user.id, email: user.email, role: user.role } }, 201);
});

app.post("/auth/login", validateJson(loginSchema), async (c) => {
  const body = c.get("validatedBody") as z.infer<typeof loginSchema>;
  const user = await db.query.users.findFirst({ where: eq(users.email, body.email) });
  if (!user || !(await verifyPassword(body.password, user.password))) return c.json({ error: "Invalid credentials" }, 401);
  return c.json({ token: await signToken(user), user: { id: user.id, email: user.email, role: user.role } });
});

app.get("/auth/me", authenticate, (c) => c.json({ user: c.get("user") }));

app.post("/workflow/run", authenticate, validateJson(runSchema), async (c) => {
  const user = c.get("user");
  const { task } = c.get("validatedBody") as z.infer<typeof runSchema>;

  const [workflow] = await db.insert(workflows).values({ task, userId: user.id }).returning();

  const plan = await ollamaChat(`You are a Planner agent. Break this task into 3 concrete steps:\n${task}`);
  await db.insert(workflowSteps).values({ workflowId: workflow.id, agent: "Planner", input: task, output: plan });

  const research = await ollamaChat(`You are a Researcher agent. Given the plan below, list key facts and tools needed:\n${plan}`);
  await db.insert(workflowSteps).values({ workflowId: workflow.id, agent: "Researcher", input: plan.slice(0, 500), output: research });

  const final = await ollamaChat(`You are a Writer agent. Produce a final deliverable for the task using this research:\nTask: ${task}\nResearch: ${research}`);
  await db.insert(workflowSteps).values({ workflowId: workflow.id, agent: "Writer", input: research.slice(0, 500), output: final });

  const steps = await db.query.workflowSteps.findMany({ where: (s, { eq }) => eq(s.workflowId, workflow.id) });
  return c.json({ task, workflowId: workflow.id, steps: steps.map((s) => ({ agent: s.agent, input: s.input, output: s.output })) });
});

app.get("/admin/workflows", authenticate, requireRole("admin"), async (c) => {
  const rows = await db.query.workflows.findMany({ with: { steps: true } });
  return c.json({ workflows: rows });
});

export default app;
