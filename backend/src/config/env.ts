import {z} from "zod";

const EnvSchema = z.object({
  DB_URL: z.string().url(),
  // JWT_SECRET: z.string().min(1),
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const ENV = EnvSchema.parse(process.env);