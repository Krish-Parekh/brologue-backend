/**
 * Exercise-related types
 */

// ============================================================================
// Request Types
// ============================================================================

/**
 * Single exercise entry in a session
 */
export interface ExerciseEntry {
	exerciseId: string;
	reps: number;
	completed: boolean;
	order: number;
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
	reps: number;
	completed: boolean;
	order: number;
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
