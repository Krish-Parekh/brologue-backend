import {
	integer,
	pgTable,
	text,
	timestamp,
	primaryKey,
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
	},
	(table) => [primaryKey({ columns: [table.userId] })],
);
