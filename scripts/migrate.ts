import { ensureSchema } from "@/lib/ensure-schema";
import { postgresClient } from "@/lib/db";

async function main() {
  await ensureSchema();
  console.log("Database migration complete.");
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await postgresClient.end();
  });
