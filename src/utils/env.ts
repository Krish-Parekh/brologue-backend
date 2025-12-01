import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env" });

export const envSchema = z.object({
	PORT: z.string().transform((val) => parseInt(val, 10)),
	DATABASE_URL: z.string(),
	CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
