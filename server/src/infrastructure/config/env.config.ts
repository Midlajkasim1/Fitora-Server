// src/infrastructure/config/env.config.ts
import { z } from "zod";

const envSchema = z.object({
    PORT: z.string().default("4000"),
    MONGO_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),
    GOOGLE_CLIENT_ID: z.string(),
    EMAIL_USER: z.string().email(),
    EMAIL_PASS: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    REDIS_URL: z.string().url().default("redis://127.0.0.1:6379")
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const env = _env.data;