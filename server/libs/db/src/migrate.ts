import { join } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db.client.js';

export function runMigrations() {
  return migrate(db, {
    migrationsFolder: join(process.cwd(), 'libs/db/src/drizzle'),
  });
}
