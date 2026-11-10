import { defineConfig } from 'drizzle-kit';

try {
  process.loadEnvFile('../.env');
} catch {}

export default defineConfig({
  schema: './libs/db/src/schema.ts',
  out: './libs/db/src/drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
});
