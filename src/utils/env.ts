import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const envSchema = z.object({
	PORT: z.string().transform((val) => parseInt(val)),
	DATABASE_URL: z.string(),
	CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
