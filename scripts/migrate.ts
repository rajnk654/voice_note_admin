import { postgresClient } from "@/lib/db";

async function main() {
  await postgresClient`
    create table if not exists "user" (
      "id" text primary key,
      "name" text not null,
      "email" text not null unique,
      "email_verified" boolean not null,
      "image" text,
      "username" text unique,
      "display_username" text,
      "created_at" timestamptz not null,
      "updated_at" timestamptz not null
    );
  `;

  await postgresClient`
    create table if not exists "session" (
      "id" text primary key,
      "user_id" text not null references "user"("id") on delete cascade,
      "token" text not null unique,
      "expires_at" timestamptz not null,
      "ip_address" text,
      "user_agent" text,
      "created_at" timestamptz not null,
      "updated_at" timestamptz not null
    );
  `;

  await postgresClient`
    create index if not exists "session_user_id_idx" on "session" ("user_id");
  `;

  await postgresClient`
    create table if not exists "account" (
      "id" text primary key,
      "user_id" text not null references "user"("id") on delete cascade,
      "account_id" text not null,
      "provider_id" text not null,
      "access_token" text,
      "refresh_token" text,
      "access_token_expires_at" timestamptz,
      "refresh_token_expires_at" timestamptz,
      "scope" text,
      "id_token" text,
      "password" text,
      "created_at" timestamptz not null,
      "updated_at" timestamptz not null
    );
  `;

  await postgresClient`
    create index if not exists "account_user_id_idx" on "account" ("user_id");
  `;

  await postgresClient`
    create table if not exists "verification" (
      "id" text primary key,
      "identifier" text not null,
      "value" text not null,
      "expires_at" timestamptz not null,
      "created_at" timestamptz not null,
      "updated_at" timestamptz not null
    );
  `;

  await postgresClient`
    create table if not exists "transcript" (
      "id" text primary key,
      "user_id" text not null references "user"("id") on delete cascade,
      "source_file_name" text not null,
      "transcript_text" text not null,
      "created_at" timestamptz not null
    );
  `;

  await postgresClient`
    create index if not exists "transcript_user_id_idx" on "transcript" ("user_id");
  `;

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
