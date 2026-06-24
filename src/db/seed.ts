import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { users } from "./schema";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const hash = await bcrypt.hash(password, 12);

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    await db.update(users).set({ password: hash, role: "admin" }).where(eq(users.email, email));
  } else {
    await db.insert(users).values({ email, password: hash, role: "admin" });
  }

  console.log(`Seeded admin: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
