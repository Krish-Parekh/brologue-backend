import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userBadges = pgTable(
	"user_badges",
	{
		userId: text("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		badgeId: text("badge_id").notNull(),
		earnedAt: timestamp("earned_at").defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.badgeId] })],
);
