import type { Week, DailyChallenge } from "./challenge";

/**
 * Response types for challenge endpoints
 */

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
export interface FocusAreaWithCompletion extends Omit<Week["focusAreas"][0], "dailyChallenges"> {
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
}

/**
 * Response data for createDailyProgress endpoint
 */
export interface CreateDailyProgressResponseData {
	message: string;
}

