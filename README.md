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

## Production

1. Set a strong `BETTER_AUTH_SECRET` (32+ random characters), `DATABASE_URL`, and a real `GEMINI_API_KEY`.
2. Set `BETTER_AUTH_URL` to your HTTPS domain (for Railway, you can skip this if `RAILWAY_PUBLIC_DOMAIN` is available).
3. Run `npm run build`.
4. Run `npm run start`.

For a secure auth secret, use `openssl rand -base64 32` or `npx auth secret`.

## Railway notes

- Railway usually exposes your public hostname as `RAILWAY_PUBLIC_DOMAIN`.
- This app now auto-derives `BETTER_AUTH_URL=https://$RAILWAY_PUBLIC_DOMAIN` when `BETTER_AUTH_URL` is unset.
- `next build` can run without `BETTER_AUTH_SECRET`, but the production server will require it at runtime.
- In production runtime (`next start`), `BETTER_AUTH_SECRET` must be explicitly provided.

