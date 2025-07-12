import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().optional().default('sqlite://./dev.db'),
  GEMINI_API_KEY: z.string().default('temp-key'),
})

export const env = envSchema.parse(process.env)
