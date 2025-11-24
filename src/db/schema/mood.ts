import {
	date,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const mood = pgTable(
	"mood",
	{
		userId: text("user_id")
			.references(() => users.id)
			.notNull(),
		mood_id: text("mood_id").notNull(),
		date: date("date").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.date] })],
);
