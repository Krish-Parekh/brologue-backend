import { integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";
import { workoutPlans } from "./workout_plans";

export const workoutExerciseCompletions = pgTable(
	"workout_exercise_completions",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		planId: text("plan_id")
			.references(() => workoutPlans.id, { onDelete: "cascade" })
			.notNull(),
		levelNumber: integer("level_number").notNull(), // 1-5
		exerciseName: text("exercise_name").notNull(), // Must match exercise name from plan
		plannedSets: integer("planned_sets").notNull(), // Original sets from plan
		plannedReps: integer("planned_reps").notNull(), // Original reps from plan
		completedSets: integer("completed_sets").notNull(), // Actual sets completed (editable)
		completedReps: integer("completed_reps").notNull(), // Actual reps completed (editable)
		completedAt: timestamp("completed_at").defaultNow().notNull(), // When the exercise was completed
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		// User can only complete each exercise once per level per plan
		unique().on(
			table.userId,
			table.planId,
			table.levelNumber,
			table.exerciseName,
		),
	],
);
