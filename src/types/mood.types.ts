/**
 * Mood-related types
 */

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request body for creating/updating a mood entry
 */
export interface CreateMoodRequestBody {
	mood_id: string;
	date?: string; // Optional, defaults to today if not provided
}

/**
 * Request parameters for getting mood by date
 */
export interface GetMoodRequestParams {
	date: string; // Format: YYYY-MM-DD
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Mood entry data
 */
export interface MoodEntry {
	userId: string;
	mood_id: string;
	date: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Response data for create/update mood endpoint
 */
export interface CreateMoodResponseData {
	mood: MoodEntry;
}

/**
 * Response data for get mood endpoint
 */
export interface GetMoodResponseData {
	mood: MoodEntry | null;
}

