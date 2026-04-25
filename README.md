# Voice Note Admin

Single-admin transcription app built with Next.js, PostgreSQL, Better Auth, and Gemini.

## Stack

- Next.js App Router
- PostgreSQL
- Drizzle ORM
- Better Auth with username + password login
- Gemini API for server-side audio transcription

## Setup

1. Copy `.env.example` to `.env`.
2. Update `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `GEMINI_API_KEY`.
3. Run `npm install`.
4. Run `npm run db:migrate`.
5. Run `npm run db:seed`.
6. Run `npm run dev`.

## Admin Credentials

- Username: `admin`
- Password: `Admin123!`

Override them with `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` before seeding if needed.

## Behavior

- Only transcript text is stored in PostgreSQL.
- Uploaded audio is processed in memory on the server and is not persisted.
- The upload form checks for files under 60 seconds on the client before submission.
