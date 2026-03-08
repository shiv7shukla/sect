import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  DB_URL: z.string().min(1),
  NODE_ENV: z
    .enum(["DEVELOPMENT", "TEST", "production"])
    .default("DEVELOPMENT"),
  JWT_SECRET: z.string().min(1),
});

export const ENV = EnvSchema.parse(process.env);
