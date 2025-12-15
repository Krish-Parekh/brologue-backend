/**
 * Exercise-related types
 */

import { z } from "zod";

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Schema for validating generate and store workout plan request body
 */
export const generateAndStoreWorkoutPlanRequestSchema = z
	.object({
		goal: z.string().min(1, "Goal is required"),
		fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
		frequency: z
			.number()
			.int()
			.min(1, "Frequency must be at least 1 day per week")
			.max(7, "Frequency cannot exceed 7 days per week"),
	})
	.strict();

/**
 * Schema for validating update exercise completion request body
 */
export const updateExerciseCompletionRequestSchema = z
	.object({
		levelNumber: z.number().int().min(1).max(5),
		exerciseName: z.string().min(1, "Exercise name is required"),
		completedSets: z.number().int().min(0),
		completedReps: z.number().int().min(0),
	})
	.strict();

/**
 * Schema for validating update exercise plan request body
 */
export const updateExercisePlanRequestSchema = z
	.object({
		levelNumber: z.number().int().min(1).max(5),
		exerciseName: z.string().min(1, "Exercise name is required"),
		sets: z.number().int().min(1, "Sets must be at least 1"),
		reps: z.number().int().min(1, "Reps must be at least 1"),
	})
	.strict();

// ============================================================================
// Request Types
// ============================================================================

/**
 * Single exercise entry in a session
 */
export interface ExerciseEntry {
	exerciseId: string;
	completed: boolean;
}

/**
 * Request body for creating/updating exercise session
 */
export interface CreateExerciseSessionRequestBody {
	exercises: ExerciseEntry[];
	date?: string; // Optional, defaults to today if not provided
}

/**
 * Request parameters for getting exercises by date
 */
export interface GetExerciseRequestParams {
	date: string; // Format: YYYY-MM-DD
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Exercise entry data from database
 */
export interface ExerciseEntryData {
	userId: string;
	date: string;
	exerciseId: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Response data for create/update exercise session endpoint
 */
export interface CreateExerciseSessionResponseData {
	exercises: ExerciseEntryData[];
}

/**
 * Response data for get exercises endpoint
 */
export interface GetExercisesResponseData {
	exercises: ExerciseEntryData[];
}

/**
 * Exercise data within a level
 */
export interface ExercisePlanExercise {
	name: string;
	sets: number;
	reps: number;
	restSeconds: number;
	instructions: string;
}

/**
 * Level data within an exercise plan
 */
export interface ExercisePlanLevel {
	levelNumber: number;
	difficulty: string;
	exercises: ExercisePlanExercise[];
}

/**
 * Response data for generate exercise plan endpoint
 */
export interface GenerateExercisePlanResponseData {
	goal: string;
	fitnessLevel: "beginner" | "intermediate" | "advanced";
	frequency: number;
	levels: ExercisePlanLevel[];
}

// ============================================================================
// Workout Plan Types
// ============================================================================

/**
 * Workout plan data stored in database
 */
export interface WorkoutPlanData {
	id: string;
	userId: string;
	goal: string;
	fitnessLevel: "beginner" | "intermediate" | "advanced";
	frequency: number;
	planData: GenerateExercisePlanResponseData; // Full plan structure
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Exercise completion data stored in database
 */
export interface WorkoutExerciseCompletionData {
	id: string;
	userId: string;
	planId: string;
	levelNumber: number;
	exerciseName: string;
	plannedSets: number;
	plannedReps: number;
	completedSets: number;
	completedReps: number;
	completedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Request body for updating exercise completion
 */
export interface UpdateExerciseCompletionRequestBody {
	levelNumber: number; // 1-5
	exerciseName: string; // Must match exercise name from plan
	completedSets: number;
	completedReps: number;
}

/**
 * Response data for get workout plan endpoint
 */
export interface GetWorkoutPlanResponseData {
	plan: WorkoutPlanData;
	completions: WorkoutExerciseCompletionData[];
	statistics: {
		goalCompletionPercentage: number; // 0-100
		totalExercises: number; // Total exercises across all levels
		completedExercises: number; // Count of unique completed exercises
		currentLevel: number; // Highest level with at least one completed exercise
	};
}

/**
 * Response data for generate and store workout plan endpoint
 */
export interface GenerateAndStoreWorkoutPlanResponseData {
	id: string;
	goal: string;
	fitnessLevel: "beginner" | "intermediate" | "advanced";
	frequency: number;
	levels: ExercisePlanLevel[];
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Response data for update exercise completion endpoint
 */
export interface UpdateExerciseCompletionResponseData {
	completion: WorkoutExerciseCompletionData;
}

/**
 * Request body for updating exercise sets/reps in plan
 */
export interface UpdateExercisePlanRequestBody {
	levelNumber: number; // 1-5
	exerciseName: string; // Must match exercise name from plan
	sets: number;
	reps: number;
}
