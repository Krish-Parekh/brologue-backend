CREATE TABLE "exercise" (
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"exercise_id" text NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exercise_user_id_date_exercise_id_pk" PRIMARY KEY("user_id","date","exercise_id")
);
--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "exercise_current_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "exercise_longest_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "statistics" ADD COLUMN "last_exercise_date" timestamp;--> statement-breakpoint
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;