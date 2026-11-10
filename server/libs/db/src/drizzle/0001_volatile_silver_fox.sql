ALTER TABLE "workflows" ADD COLUMN "status" text DEFAULT 'completed' NOT NULL;--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "completed_at" timestamp;