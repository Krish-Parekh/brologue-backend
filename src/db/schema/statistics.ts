import {
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const statistics = pgTable(
	"statistics",
	{
		userId: text("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		longestStreak: integer("longest_streak").notNull().default(0),
		currentStreak: integer("current_streak").notNull().default(0),
		lastLogDate: timestamp("last_log_date").defaultNow(),
		exerciseCurrentStreak: integer("exercise_current_streak")
			.notNull()
			.default(0),
		exerciseLongestStreak: integer("exercise_longest_streak")
			.notNull()
			.default(0),
		lastExerciseDate: timestamp("last_exercise_date"),
	},
	(table) => [primaryKey({ columns: [table.userId] })],
);
