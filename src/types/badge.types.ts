import type { BadgeDefinition } from "../constants/badges";

/**
 * Badge with user's earned status and progress
 */
export interface UserBadge {
	badge: BadgeDefinition;
	earned: boolean;
	earnedAt?: Date;
	progress: number;
	progressTarget?: number;
}

/**
 * Response data for get user badges endpoint
 */
export interface GetUserBadgesResponseData {
	badges: UserBadge[];
}

/**
 * Completion data passed to badge checking service
 */
export interface BadgeCompletionData {
	completedAt: Date;
	completedReps: number;
}
