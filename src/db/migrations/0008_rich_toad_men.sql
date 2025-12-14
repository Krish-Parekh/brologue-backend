CREATE TABLE "workout_exercise_completions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"level_number" integer NOT NULL,
	"exercise_name" text NOT NULL,
	"planned_sets" integer NOT NULL,
	"planned_reps" integer NOT NULL,
	"completed_sets" integer NOT NULL,
	"completed_reps" integer NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workout_exercise_completions_user_id_plan_id_level_number_exercise_name_unique" UNIQUE("user_id","plan_id","level_number","exercise_name")
);
--> statement-breakpoint
CREATE TABLE "workout_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"goal" text NOT NULL,
	"fitness_level" text NOT NULL,
	"frequency" integer NOT NULL,
	"plan_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workout_plans_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "workout_exercise_completions" ADD CONSTRAINT "workout_exercise_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercise_completions" ADD CONSTRAINT "workout_exercise_completions_plan_id_workout_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;