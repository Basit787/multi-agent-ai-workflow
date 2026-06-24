CREATE TABLE IF NOT EXISTS "workflows" (
  "id" serial PRIMARY KEY NOT NULL,
  "task" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "workflow_steps" (
  "id" serial PRIMARY KEY NOT NULL,
  "workflow_id" integer NOT NULL REFERENCES "workflows"("id") ON DELETE CASCADE,
  "agent" text NOT NULL,
  "input" text NOT NULL,
  "output" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
