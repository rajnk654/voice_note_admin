import { postgresClient } from "@/lib/db";

let ensureSchemaPromise: Promise<void> | null = null;

async function runEnsureSchema() {
  await postgresClient`
    create table if not exists "user" (
      "id" text primary key,
      "name" text not null,
      "email" text not null unique,
      "email_verified" boolean not null default false,
      "image" text,
      "username" text unique,
      "display_username" text,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now()
    );
  `;

  await postgresClient`
    alter table "user"
      add column if not exists "name" text,
      add column if not exists "email" text,
      add column if not exists "email_verified" boolean,
      add column if not exists "image" text,
      add column if not exists "username" text,
      add column if not exists "display_username" text,
      add column if not exists "created_at" timestamptz,
      add column if not exists "updated_at" timestamptz;
  `;

  await postgresClient`
    alter table "user"
      alter column "name" set default 'Unknown User',
      alter column "email" set default '',
      alter column "email_verified" set default false,
      alter column "created_at" set default now(),
      alter column "updated_at" set default now();
  `;

  await postgresClient`
    update "user"
    set
      "name" = coalesce("name", 'Unknown User'),
      "email" = coalesce("email", concat('user-', "id", '@example.invalid')),
      "email_verified" = coalesce("email_verified", false),
      "created_at" = coalesce("created_at", now()),
      "updated_at" = coalesce("updated_at", now())
    where
      "name" is null
      or "email" is null
      or "email_verified" is null
      or "created_at" is null
      or "updated_at" is null;
  `;

  await postgresClient`
    alter table "user"
      alter column "name" set not null,
      alter column "email" set not null,
      alter column "email_verified" set not null,
      alter column "created_at" set not null,
      alter column "updated_at" set not null;
  `;

  await postgresClient`
    create unique index if not exists "user_email_unique" on "user" ("email");
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
}

export async function ensureSchema() {
  if (!ensureSchemaPromise) {
    ensureSchemaPromise = runEnsureSchema();
  }

  await ensureSchemaPromise;
}
