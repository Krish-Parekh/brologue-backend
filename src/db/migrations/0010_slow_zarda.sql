ALTER TABLE "workout_plans" ADD COLUMN "workout_type" text;--> statement-breakpoint
ALTER TABLE "workout_plans" ADD COLUMN "workout_plan" jsonb;--> statement-breakpoint
UPDATE "workout_plans" SET "workout_type" = 'Strength training' WHERE "workout_type" IS NULL;--> statement-breakpoint
UPDATE "workout_plans" SET "workout_plan" = '{}'::jsonb WHERE "workout_plan" IS NULL;--> statement-breakpoint
ALTER TABLE "workout_plans" ALTER COLUMN "workout_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_plans" ALTER COLUMN "workout_plan" SET NOT NULL;