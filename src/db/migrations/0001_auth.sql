CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "role" text NOT NULL DEFAULT 'user',
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "workflows" ADD COLUMN IF NOT EXISTS "user_id" integer REFERENCES "users"("id");
