/**
 * Challenge-related types
 * Consolidated from challenge.ts, challenge-requests.ts, and challenge-responses.ts
 */

// ============================================================================
// Core Challenge Types
// ============================================================================

export type MantraType = "daily" | "weekly";
export type PromptType = "daily" | "weekly";

export interface DailyChallenge {
	day: number;
	title: string;
	description: string;
	actionItems: string[];
}

export interface FocusArea {
	id: string;
	title: string;
	description: string;
	dailyChallenges: DailyChallenge[];
}

export interface Mantra {
	id: string;
	text: string;
	type: MantraType;
	day?: number;
}

export interface Prompt {
	id: string;
	text: string;
	type: PromptType;
	day?: number;
}

export interface Week {
	id: number;
	title: string;
	theme: string;
	description: string;
	unlocked: boolean;
	focusAreas: FocusArea[];
	mantras: Mantra[];
	prompts: Prompt[];
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request parameters for getting a specific week
 */
export interface GetWeekRequestParams {
	weekId: number;
}

/**
 * Request parameters for getting a specific day
 */
export interface GetDayRequestParams {
	weekId: number;
	dayNumber: number;
}

/**
 * Request parameters for creating daily progress
 */
export interface CreateDailyProgressRequestParams {
	weekId: number;
	dayNumber: number;
}

/**
 * Request body for creating daily progress
 */
export interface CreateDailyProgressRequestBody {
	notes?: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Week with unlocked status for getAllWeeks endpoint
 */
export interface WeekWithUnlocked extends Omit<Week, "unlocked"> {
	unlocked: boolean;
}

/**
 * Daily challenge with completion status
 */
export interface DailyChallengeWithCompletion extends DailyChallenge {
	isCompleted: boolean;
}

/**
 * Focus area with completed challenges
 */
export interface FocusAreaWithCompletion
	extends Omit<Week["focusAreas"][0], "dailyChallenges"> {
	dailyChallenges: DailyChallengeWithCompletion[];
}

/**
 * Week with completion status for getWeek endpoint
 */
export interface WeekWithCompletion extends Omit<Week, "focusAreas"> {
	focusAreas: FocusAreaWithCompletion[];
}

/**
 * Response data for getAllWeeks endpoint
 */
export interface GetAllWeeksResponseData {
	currentWeek: number;
	dayStreak: number;
	totalWeeksCompleted: number;
	weekProgress: number;
	weeks: WeekWithUnlocked[];
}

/**
 * Response data for getWeek endpoint
 */
export interface GetWeekResponseData extends WeekWithCompletion {}

/**
 * Response data for getDay endpoint
 */
export interface GetDayResponseData {
	day: number;
	title: string;
	description: string;
	prompts: Week["prompts"][0] | undefined;
	mantras: Week["mantras"][0] | undefined;
	notes?: string | null;
}

/**
 * Response data for createDailyProgress endpoint
 */
export interface CreateDailyProgressResponseData {
	message: string;
}
