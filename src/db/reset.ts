import { Pool } from "pg";

async function reset() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await pool.end();
  console.log("PostgreSQL schema reset (public)");
  process.exit(0);
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
