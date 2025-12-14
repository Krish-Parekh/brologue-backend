import { integer, jsonb, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const workoutPlans = pgTable(
	"workout_plans",
	{
		id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
		userId: text("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		goal: text("goal").notNull(),
		fitnessLevel: text("fitness_level").notNull(), 
		frequency: integer("frequency").notNull(), 
		planData: jsonb("plan_data").notNull(), 
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		unique().on(table.userId), 
	],
);
