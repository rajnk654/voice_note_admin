import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, postgresClient } from "@/lib/db";
import { env } from "@/lib/env";
import { users } from "@/lib/schema";

async function main() {
  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.username, env.ADMIN_USERNAME),
  });

  if (existingAdmin) {
    console.log(`Admin user "${env.ADMIN_USERNAME}" already exists.`);
    return;
  }

  await auth.api.signUpEmail({
    body: {
      email: env.ADMIN_EMAIL,
      name: env.ADMIN_NAME,
      password: env.ADMIN_PASSWORD,
      username: env.ADMIN_USERNAME,
      displayUsername: env.ADMIN_USERNAME,
    },
    headers: new Headers(),
  });

  console.log(`Admin user "${env.ADMIN_USERNAME}" created.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await postgresClient.end();
  });
