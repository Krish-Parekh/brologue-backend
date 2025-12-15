/**
 * Mood-related types
 */

import { z } from "zod";

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Schema for validating create/update mood request body
 */
export const createMoodRequestSchema = z
	.object({
		mood_id: z.string().min(1, "mood_id is required"),
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
			.optional(),
	})
	.strict();

/**
 * Schema for validating get mood by date request parameters
 */
export const getMoodRequestSchema = z
	.object({
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	})
	.strict();

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
