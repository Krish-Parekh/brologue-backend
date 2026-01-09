import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ALL_BADGES, BadgeCriteriaType } from "../constants/badges";
import { db } from "../db";
import { userBadges } from "../db/schema/user_badges";
import type { GetUserBadgesResponseData } from "../types/badge.types";
import type { ApiResponse } from "../types/response";
import {
	getBadgeProgress,
	getUserEarnedBadges,
} from "../utils/badges";
import Logger from "../utils/logger";

/**
 * Get all badges with user's earned status and progress
 */
export const getUserBadges = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;

	try {
		// Get user's earned badges
		const earnedBadgeIds = await getUserEarnedBadges(userId);

		// Get earned badges with timestamps
		const earnedBadgesWithTime = await db
			.select()
			.from(userBadges)
			.where(eq(userBadges.userId, userId));

		const earnedBadgesMap = new Map(
			earnedBadgesWithTime.map((eb) => [eb.badgeId, eb.earnedAt]),
		);

		// Get progress data
		const progress = await getBadgeProgress(userId);

		// Build response with all badges
		const userBadgesList = ALL_BADGES.map((badge) => {
			const isEarned = earnedBadgeIds.has(badge.id);
			const earnedAt = earnedBadgesMap.get(badge.id);

			let progressValue = 0;
			let progressTarget: number | undefined = undefined;

			// Calculate progress based on badge type
			switch (badge.criteriaType) {
				case BadgeCriteriaType.FIRST_WORKOUT:
					progressValue = progress.workoutCount;
					progressTarget = 1;
					break;

				case BadgeCriteriaType.WORKOUT_COUNT:
					progressValue = progress.workoutCount;
					progressTarget = badge.criteriaValue;
					break;

				case BadgeCriteriaType.FIRST_REP:
					progressValue = progress.hasAnyRep ? 1 : 0;
					progressTarget = 1;
					break;

				case BadgeCriteriaType.TOTAL_REPS:
					progressValue = progress.totalReps;
					progressTarget = badge.criteriaValue;
					break;

				case BadgeCriteriaType.EARLY_BIRD:
				case BadgeCriteriaType.NIGHT_OWL:
					// For time-based badges, progress is binary (earned or not)
					progressValue = isEarned ? 1 : 0;
					progressTarget = 1;
					break;
			}

			return {
				badge,
				earned: isEarned,
				earnedAt: earnedAt || undefined,
				progress: progressValue,
				progressTarget,
			};
		});

		const responseData: GetUserBadgesResponseData = {
			badges: userBadgesList,
		};

		const apiResponse: ApiResponse<GetUserBadgesResponseData> = {
			code: StatusCodes.OK,
			message: "Badges retrieved successfully",
			data: responseData,
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		Logger.error(`[getUserBadges] Error for userId: ${userId}`, error);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message:
				error instanceof Error
					? `Failed to retrieve badges: ${error.message}`
					: "Failed to retrieve badges",
			data: null,
		};
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
	}
};
