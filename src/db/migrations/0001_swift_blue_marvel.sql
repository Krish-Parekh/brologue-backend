CREATE TABLE "week_progress" (
	"user_id" text NOT NULL,
	"week_id" integer NOT NULL,
	"days_completed" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"unlocked_at" timestamp DEFAULT now(),
	CONSTRAINT "week_progress_user_id_week_id_unique" UNIQUE("user_id","week_id")
);
--> statement-breakpoint
ALTER TABLE "week_progress" ADD CONSTRAINT "week_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;