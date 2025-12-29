import type {
	FitnessLevel,
	GenerateExercisePlanResponseData,
	WorkoutFrequency,
	WorkoutPlan,
} from "../types/exercise.types";

/**
 * Capitalizes fitness level string
 */
export function capitalizeFitnessLevel(
	level: string,
): FitnessLevel {
	return (level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()) as FitnessLevel;
}

/**
 * Maps number to workout frequency string
 */
export function mapNumberToFrequency(frequency: number): WorkoutFrequency {
	if (frequency <= 2) return "1-2 times per week";
	if (frequency <= 4) return "3-4 times per week";
	if (frequency <= 6) return "5-6 times per week";
	return "Daily";
}

/**
 * Transforms API response to WorkoutPlan format for UI display
 */
export function transformToWorkoutPlan(
	apiData: GenerateExercisePlanResponseData,
	workoutType: string,
): WorkoutPlan {
	return {
		title: `Personalized ${workoutType} Workout Plan for ${apiData.goal}`,
		userInfo: {
			fitnessGoal: apiData.goal,
			fitnessLevel: capitalizeFitnessLevel(apiData.fitnessLevel),
			preferredWorkout: workoutType,
			workoutFrequency: mapNumberToFrequency(apiData.frequency),
		},
		levels: apiData.levels.map((level) => ({
			levelNumber: level.levelNumber,
			difficulty: level.difficulty,
			exercises: level.exercises.map((exercise) => ({
				name: exercise.name,
				sets: exercise.sets,
				reps: exercise.reps,
				restSeconds: exercise.restSeconds,
				instructions: exercise.instructions,
			})),
		})),
	};
}

