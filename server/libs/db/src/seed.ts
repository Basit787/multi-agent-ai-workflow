import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { DbService } from './db.service.js';
import { accounts, users } from './schema.js';

const db = new DbService();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hash = await bcrypt.hash(password, 12);

  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (user) {
    await db.update(users, user.id, { role: 'admin' });
  } else {
    user = await db.insert(users, { email, name: 'Admin', role: 'admin' });
  }

  const credential = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, user.id),
      eq(accounts.providerId, 'credential'),
    ),
  });
  if (credential) {
    await db.update(accounts, credential.id, { password: hash });
  } else {
    await db.insert(accounts, {
      userId: user.id,
      accountId: String(user.id),
      providerId: 'credential',
      password: hash,
    });
  }

  console.log(`Seeded admin: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
