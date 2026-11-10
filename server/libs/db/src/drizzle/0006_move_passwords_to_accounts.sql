-- Better Auth keeps email/password logins in "accounts" (provider "credential").
-- Move each existing bcrypt hash there; Better Auth is set to verify bcrypt.
INSERT INTO "accounts" ("user_id", "account_id", "provider_id", "password")
SELECT "id", "id"::text, 'credential', "password" FROM "users";
--> statement-breakpoint
UPDATE "users" SET "name" = split_part("email", '@', 1) WHERE "name" = '';
