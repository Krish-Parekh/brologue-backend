import type {
	GenerateExercisePlanResponseData,
	WorkoutExerciseCompletionData,
} from "../types/exercise.types";

/**
 * Calculate workout plan statistics
 */
export const calculateWorkoutStatistics = (
	plan: GenerateExercisePlanResponseData,
	completions: WorkoutExerciseCompletionData[],
): {
	goalCompletionPercentage: number;
	totalExercises: number;
	completedExercises: number;
	currentLevel: number;
} => {
	// Count total unique exercises across all levels
	// Each level has 5 exercises, so typically 25 total
	const totalExercises = plan.levels.reduce(
		(total, level) => total + level.exercises.length,
		0,
	);

	// Count unique completed exercises
	// Use Set to track unique (levelNumber, exerciseName) combinations
	const completedExerciseSet = new Set<string>();
	completions.forEach((completion) => {
		const key = `${completion.levelNumber}-${completion.exerciseName}`;
		completedExerciseSet.add(key);
	});
	const completedExercises = completedExerciseSet.size;

	// Calculate percentage
	const goalCompletionPercentage = Math.min(
		Math.round((completedExercises / totalExercises) * 100),
		100,
	);

	// Find current level: highest level with at least one completed exercise
	let currentLevel = 0;
	if (completions.length > 0) {
		currentLevel = Math.max(...completions.map((c) => c.levelNumber));
	}

	return {
		goalCompletionPercentage,
		totalExercises,
		completedExercises,
		currentLevel,
	};
};
