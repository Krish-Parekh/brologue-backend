import { integer, pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const dailyWeekProgress = pgTable(
	"daily_week_progress",
	{
		userId: text("user_id")
			.references(() => users.id)
			.notNull(),
		weekId: integer("week_id").notNull(),
		dayNumber: integer("day_number").notNull(),
		notes: text("notes"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.weekId, table.dayNumber] })],
);
