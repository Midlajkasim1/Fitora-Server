import { z } from "zod";
import dotenv from "dotenv";
import { logger } from "../providers/loggers/logger";

dotenv.config();
const envSchema = z.object({
    PORT: z.string().default("4000"),
    CLIENT_URL: z.string().url(),
    MONGO_URL: z.string().url(),
    JWT_ACCESS_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),
    GOOGLE_CLIENT_ID: z.string(),
    EMAIL_USER: z.string().email(),
    EMAIL_PASS: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    REDIS_URL: z.string().url().default("redis://127.0.0.1:6379"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1).default("us-east-1"),
    S3_BUCKET_NAME: z.string().min(1),
    ACCESS_TOKEN_MAX_AGE: z.coerce.number().default(900000),
    REFRESH_TOKEN_MAX_AGE: z.coerce.number().default(604800000),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_test_"),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
    MISTRAL_API_KEY: z.string().min(30, "MISTRAL API Key is too short"),
   
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    logger.error(" Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const env = _env.data;