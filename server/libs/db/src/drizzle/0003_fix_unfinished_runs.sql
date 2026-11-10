-- Runs from before the status column defaulted to 'completed'. Any of them
-- with fewer than three agent steps never finished, so mark them failed.
UPDATE "workflows"
SET "status" = 'failed', "completed_at" = COALESCE("completed_at", now())
WHERE "status" = 'completed'
  AND (SELECT count(*) FROM "workflow_steps" s WHERE s."workflow_id" = "workflows"."id") < 3;
