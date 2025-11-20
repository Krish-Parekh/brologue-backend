CREATE TABLE "statistics" (
	"user_id" text NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"last_log_date" timestamp DEFAULT now(),
	CONSTRAINT "statistics_user_id_pk" PRIMARY KEY("user_id")
);
--> statement-breakpoint
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;