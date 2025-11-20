import { integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const weekProgress = pgTable('week_progress', {
    userId: text('user_id').references(() => users.id).notNull(),
    weekId: integer('week_id').notNull(),
    daysCompleted: integer('days_completed').notNull().default(0),
    startedAt: timestamp('started_at').defaultNow(),
    completedAt: timestamp('completed_at'),
    unlockedAt: timestamp('unlocked_at').defaultNow(),
}, (table) => [
    unique().on(table.userId, table.weekId),
]);