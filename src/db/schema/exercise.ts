import {
	boolean,
	date,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const exercise = pgTable(
	"exercise",
	{
		userId: text("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		date: date("date").notNull(),
		exerciseId: text("exercise_id").notNull(),
		completed: boolean("completed").notNull().default(false),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.date, table.exerciseId] }),
	],
);
