import * as nextEnv from "@next/env";
import { z } from "zod";

const nextEnvCompat = nextEnv as typeof nextEnv & {
  default?: { loadEnvConfig?: (dir: string) => void };
};

const loadEnvConfig =
  nextEnvCompat.loadEnvConfig ?? nextEnvCompat.default?.loadEnvConfig;

loadEnvConfig?.(process.cwd());

const isProduction = process.env.NODE_ENV === "production";
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  GEMINI_API_KEY: z.string().min(1),
  ADMIN_USERNAME: z.string().min(3).default("admin"),
  ADMIN_PASSWORD: z.string().min(8).default("Admin123!"),
  ADMIN_EMAIL: z.email().default("admin@example.com"),
  ADMIN_NAME: z.string().min(1).default("Voice Note Admin"),
});

const inferredRailwayBaseUrl = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : undefined;

const devOnlyFallbackSecret =
  "dev-only-change-me-4f8b6c2e1d9a7f0b5c3e8a1d6f2b9c4";

export const env = envSchema.parse({
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/voice_note_admin",
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ??
    (isProduction && !isProductionBuild
      ? undefined
      : devOnlyFallbackSecret),
  BETTER_AUTH_URL:
    process.env.BETTER_AUTH_URL ??
    inferredRailwayBaseUrl ??
    "http://localhost:3000",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "missing-gemini-api-key",
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_NAME: process.env.ADMIN_NAME,
});
