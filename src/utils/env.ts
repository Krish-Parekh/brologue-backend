import { z } from "zod";

export const envSchema = z
	.object({
		PORT: z.number().default(3000),
		DATABASE_URL: z.url(),
	})
	.strict();

export const env = envSchema.parse(process.env);
