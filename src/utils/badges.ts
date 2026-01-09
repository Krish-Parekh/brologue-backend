import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { userBadges } from "../db/schema/user_badges";
import { workoutExerciseCompletions } from "../db/schema/workout_exercise_completions";
import {
	ALL_BADGES,
	BadgeCriteriaType,
	type BadgeId,
} from "../constants/badges";
import type { BadgeCompletionData } from "../types/badge.types";
import Logger from "./logger";

/**
 * Get all badges a user has earned
 */
export async function getUserEarnedBadges(userId: string): Promise<Set<BadgeId>> {
	const earned = await db
		.select({ badgeId: userBadges.badgeId })
		.from(userBadges)
		.where(eq(userBadges.userId, userId));

	return new Set(earned.map((e) => e.badgeId as BadgeId));
}

/**
 * Award a badge to a user (if not already earned)
 */
export async function awardBadge(
	userId: string,
	badgeId: BadgeId,
): Promise<boolean> {
	try {
		await db
			.insert(userBadges)
			.values({
				userId,
				badgeId,
			})
			.onConflictDoNothing();
		return true;
	} catch (error) {
		Logger.error(`[awardBadge] Failed to award badge ${badgeId} to user ${userId}`, error);
		return false;
	}
}

/**
 * Count total workouts (each exercise completion = 1 workout)
 */
export async function countUserWorkouts(userId: string): Promise<number> {
	const result = await db
		.select({ count: sql<number>`cast(count(*) as integer)` })
		.from(workoutExerciseCompletions)
		.where(eq(workoutExerciseCompletions.userId, userId));

	return result[0]?.count ?? 0;
}

/**
 * Get total cumulative reps across all exercises
 */
export async function getUserTotalReps(userId: string): Promise<number> {
	const result = await db
		.select({
			total: sql<number>`cast(coalesce(sum(${workoutExerciseCompletions.completedReps}), 0) as integer)`,
		})
		.from(workoutExerciseCompletions)
		.where(eq(workoutExerciseCompletions.userId, userId));

	return result[0]?.total ?? 0;
}

/**
 * Check if user has completed any rep (for FIRST_REP badge)
 */
export async function hasUserCompletedAnyRep(userId: string): Promise<boolean> {
	const result = await db
		.select({ count: sql<number>`cast(count(*) as integer)` })
		.from(workoutExerciseCompletions)
		.where(
			sql`${workoutExerciseCompletions.userId} = ${userId} AND ${workoutExerciseCompletions.completedReps} > 0`,
		);

	return (result[0]?.count ?? 0) > 0;
}

/**
 * Check time-based badges (Early Bird, Night Owl)
 */
export async function checkTimeBasedBadge(
	userId: string,
	completionTime: Date,
	badgeType: BadgeCriteriaType.EARLY_BIRD | BadgeCriteriaType.NIGHT_OWL,
): Promise<boolean> {
	const hour = completionTime.getHours();

	if (badgeType === BadgeCriteriaType.EARLY_BIRD) {
		return hour < 6; // Before 6 AM
	} else if (badgeType === BadgeCriteriaType.NIGHT_OWL) {
		return hour >= 20; // 8 PM or later
	}

	return false;
}

/**
 * Main function to check and award badges based on completion data
 * Returns array of newly earned badge IDs
 */
export async function checkAndAwardBadges(
	userId: string,
	completionData: BadgeCompletionData,
): Promise<BadgeId[]> {
	const newlyEarned: BadgeId[] = [];
	const earnedBadges = await getUserEarnedBadges(userId);

	// Check each badge
	for (const badge of ALL_BADGES) {
		// Skip if already earned
		if (earnedBadges.has(badge.id as BadgeId)) {
			continue;
		}

		let shouldAward = false;

		switch (badge.criteriaType) {
			case BadgeCriteriaType.FIRST_WORKOUT: {
				// Check if this is user's first workout
				const workoutCount = await countUserWorkouts(userId);
				shouldAward = workoutCount === 1;
				break;
			}

			case BadgeCriteriaType.WORKOUT_COUNT: {
				// Check if user has reached the workout count threshold
				const workoutCount = await countUserWorkouts(userId);
				shouldAward =
					badge.criteriaValue !== undefined &&
					workoutCount >= badge.criteriaValue;
				break;
			}

			case BadgeCriteriaType.EARLY_BIRD: {
				// Check if this completion was before 6 AM
				const hour = completionData.completedAt.getHours();
				shouldAward = hour < 6;
				break;
			}

			case BadgeCriteriaType.NIGHT_OWL: {
				// Check if this completion was after 8 PM (20:00)
				const hour = completionData.completedAt.getHours();
				shouldAward = hour >= 20;
				break;
			}

			case BadgeCriteriaType.FIRST_REP: {
				// Check if user has completed any rep
				shouldAward = await hasUserCompletedAnyRep(userId);
				break;
			}

			case BadgeCriteriaType.TOTAL_REPS: {
				// Check if user has reached the total reps threshold
				const totalReps = await getUserTotalReps(userId);
				shouldAward =
					badge.criteriaValue !== undefined &&
					totalReps >= badge.criteriaValue;
				break;
			}
		}

		if (shouldAward) {
			const awarded = await awardBadge(userId, badge.id as BadgeId);
			if (awarded) {
				newlyEarned.push(badge.id as BadgeId);
				Logger.info(
					`[checkAndAwardBadges] Awarded badge ${badge.id} to user ${userId}`,
				);
			}
		}
	}

	return newlyEarned;
}

/**
 * Get badge progress for a user
 */
export async function getBadgeProgress(userId: string) {
	const earnedBadges = await getUserEarnedBadges(userId);
	const workoutCount = await countUserWorkouts(userId);
	const totalReps = await getUserTotalReps(userId);
	const hasAnyRep = await hasUserCompletedAnyRep(userId);

	return {
		earnedBadges,
		workoutCount,
		totalReps,
		hasAnyRep,
	};
}
