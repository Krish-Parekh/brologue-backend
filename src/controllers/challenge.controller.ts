import { and, desc, eq, isNotNull, max, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { challengeWeeks } from "../data/challenge";
import { db } from "../db";
import { dailyWeekProgress } from "../db/schema/daily_week_progress";
import { statistics } from "../db/schema/statistics";
import { weekProgress } from "../db/schema/week_progress";
import type {
	CreateDailyProgressRequestBody,
	CreateDailyProgressRequestParams,
	CreateDailyProgressResponseData,
	GetAllWeeksResponseData,
	GetDayRequestParams,
	GetDayResponseData,
	GetWeekRequestParams,
	GetWeekResponseData,
} from "../types/challenge.types";
import {
	dailyProgressBodySchema,
	dailyProgressParamSchema,
	dayRequestSchema,
	weekRequestSchema,
} from "../types/challenge.types";
import type { ApiResponse } from "../types/response";
import { getTodayString } from "../utils/helper";
import Logger from "../utils/logger";

/**
 * Get all challenge weeks with user progress information
 *
 * Logic:
 * 1. Retrieves user statistics (userId available from auth middleware)
 * 2. Fetches all weeks the user has started
 * 3. Determines current week (highest weekId from user's progress, default to 1)
 * 4. Counts daily progress entries for current week
 * 5. Calculates total completed weeks and current day streak
 * 6. Maps all challenge weeks and marks them as unlocked if user has started them or if it's week 1
 *
 * @returns All weeks with unlocked status, current week info, progress counts, and streak
 */
export const getAllWeeks = async (request: Request, response: Response) => {
	const { userId } = request;
	Logger.debug(`[getAllWeeks] Request started for userId: ${userId}`);

	// Fetch user statistics (for streak information)
	Logger.debug(`[getAllWeeks] Fetching user statistics for userId: ${userId}`);
	const [userStats] = await db
		.select()
		.from(statistics)
		.where(eq(statistics.userId, userId));
	Logger.debug(
		`[getAllWeeks] User statistics retrieved: ${userStats ? `streak=${userStats.currentStreak}, longest=${userStats.longestStreak}` : "no stats found"}`,
	);

	// Fetch all weeks the user has started (needed for unlock status check)
	Logger.debug(
		`[getAllWeeks] Fetching user week progress for userId: ${userId}`,
	);
	const userWeeks = await db
		.select()
		.from(weekProgress)
		.where(eq(weekProgress.userId, userId));
	Logger.debug(
		`[getAllWeeks] User weeks retrieved: ${userWeeks.length} weeks found`,
	);

	// Determine current week: highest weekId from user's progress, or default to week 1
	// Optimized: Use database ORDER BY instead of sorting in memory
	const [currentWeekObj] = await db
		.select()
		.from(weekProgress)
		.where(eq(weekProgress.userId, userId))
		.orderBy(desc(weekProgress.weekId))
		.limit(1);
	const currentWeekId = currentWeekObj ? currentWeekObj.weekId : 1;
	Logger.info(
		`[getAllWeeks] Current week determined: ${currentWeekId} ${currentWeekObj ? "(from user progress)" : "(default)"}`,
	);

	// Count daily progress entries for the current week
	// Optimized: Use database COUNT instead of loading all records
	Logger.debug(
		`[getAllWeeks] Counting daily progress for userId: ${userId}, weekId: ${currentWeekId}`,
	);
	const weekProgressResult = await db
		.select({ count: sql<number>`cast(count(*) as integer)` })
		.from(dailyWeekProgress)
		.where(
			and(
				eq(dailyWeekProgress.userId, userId),
				eq(dailyWeekProgress.weekId, currentWeekId),
			),
		);

	// Calculate progress metrics
	// Optimized: Use database COUNT with WHERE clause instead of filtering in memory
	const totalWeeksCompletedResult = await db
		.select({ count: sql<number>`cast(count(*) as integer)` })
		.from(weekProgress)
		.where(
			and(eq(weekProgress.userId, userId), isNotNull(weekProgress.completedAt)),
		);

	const weekProgressCountValue = weekProgressResult[0]?.count ?? 0;
	const totalWeeksCompletedValue = totalWeeksCompletedResult[0]?.count ?? 0;
	const dayStreak = userStats ? userStats.currentStreak : 0;
	Logger.info(
		`[getAllWeeks] Progress metrics calculated: weekProgress=${weekProgressCountValue}, totalWeeksCompleted=${totalWeeksCompletedValue}, dayStreak=${dayStreak}`,
	);

	// Map all challenge weeks and determine unlock status
	// A week is unlocked if user has started it OR if it's week 1 (always unlocked)
	const weeks = challengeWeeks.map((week) => {
		const isUnlocked =
			userWeeks.some((uw) => uw.weekId === week.id) || week.id === 1;
		return {
			...week,
			unlocked: isUnlocked,
		};
	});

	const unlockedCount = weeks.filter((w) => w.unlocked).length;
	Logger.debug(
		`[getAllWeeks] Weeks processed: ${weeks.length} total, ${unlockedCount} unlocked`,
	);

	const responseData: GetAllWeeksResponseData = {
		currentWeek: currentWeekId,
		dayStreak,
		totalWeeksCompleted: totalWeeksCompletedValue,
		weekProgress: weekProgressCountValue,
		weeks,
	};

	const apiResponse: ApiResponse<GetAllWeeksResponseData> = {
		code: StatusCodes.OK,
		message: "Challenges fetched successfully",
		data: responseData,
	};

	Logger.info(
		`[getAllWeeks] Request completed successfully for userId: ${userId}`,
	);
	return response.status(StatusCodes.OK).json(apiResponse);
};

/**
 * Get a specific challenge week with completion status for each daily challenge
 *
 * Logic:
 * 1. Validates weekId parameter
 * 2. Finds the requested week from challenge data
 * 3. Gets the maximum day number completed by user for this week (userId available from auth middleware)
 * 4. Marks daily challenges as completed if their day <= maxDayNumber
 * 5. Returns the requested week with completion status
 *
 * @returns Week data with completion status for each daily challenge
 */
export const getWeek = async (request: Request, response: Response) => {
	const { userId } = request;
	Logger.debug(
		`[getWeek] Request started for userId: ${userId}, params: ${JSON.stringify(request.params)}`,
	);

	const { weekId }: GetWeekRequestParams = weekRequestSchema.parse(
		request.params,
	);
	Logger.debug(`[getWeek] Parsed weekId: ${weekId}`);

	// Find the requested week
	const week = challengeWeeks.find((week) => week.id === weekId);
	if (!week) {
		Logger.warn(`[getWeek] Week not found: weekId=${weekId}, userId=${userId}`);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.NOT_FOUND,
			message: "Week not found",
		};
		return response.status(StatusCodes.NOT_FOUND).json(apiResponse);
	}

	Logger.debug(`[getWeek] Week found: ${week.title} (weekId: ${weekId})`);

	// Get the highest day number completed by user for this week
	// This determines which challenges are marked as completed
	Logger.debug(
		`[getWeek] Fetching daily progress for userId: ${userId}, weekId: ${weekId}`,
	);
	const userDailyProgress = await db
		.select({ value: max(dailyWeekProgress.dayNumber) })
		.from(dailyWeekProgress)
		.where(
			and(
				eq(dailyWeekProgress.userId, userId),
				eq(dailyWeekProgress.weekId, weekId),
			),
		);

	const maxDayNumber = userDailyProgress[0]?.value || 0;
	Logger.info(
		`[getWeek] Max day number completed: ${maxDayNumber} for userId: ${userId}, weekId: ${weekId}`,
	);

	// Add completion status to daily challenges for the requested week
	// A challenge is completed if its day number <= maxDayNumber completed by user
	const responseData: GetWeekResponseData = {
		...week,
		focusAreas: week.focusAreas.map((focusArea) => {
			return {
				...focusArea,
				dailyChallenges: focusArea.dailyChallenges.map((challenge) => {
					return {
						...challenge,
						isCompleted: challenge.day <= maxDayNumber,
					};
				}),
			};
		}),
	};

	const totalChallenges = responseData.focusAreas.reduce(
		(sum, area) => sum + area.dailyChallenges.length,
		0,
	);
	const completedChallenges = responseData.focusAreas.reduce(
		(sum, area) =>
			sum + area.dailyChallenges.filter((c) => c.isCompleted).length,
		0,
	);
	Logger.debug(
		`[getWeek] Completion status calculated: ${completedChallenges}/${totalChallenges} challenges completed`,
	);

	const apiResponse: ApiResponse<GetWeekResponseData> = {
		code: StatusCodes.OK,
		message: "Week fetched successfully",
		data: responseData,
	};

	Logger.info(
		`[getWeek] Request completed successfully for userId: ${userId}, weekId: ${weekId}`,
	);
	return response.status(StatusCodes.OK).json(apiResponse);
};

/**
 * Get a specific day's prompts and mantras for a given week
 *
 * Logic:
 * 1. Validates weekId and dayNumber parameters
 * 2. Finds the requested week from challenge data
 * 3. Fetches user's saved notes for this day (if they exist)
 * 4. Extracts prompts and mantras for the specific day
 * 5. Returns day information with associated prompts, mantras, and notes
 *
 * @returns Day data including prompts, mantras, and saved notes for the specified day
 */
export const getDay = async (request: Request, response: Response) => {
	const { userId } = request;
	Logger.debug(
		`[getDay] Request started for userId: ${userId}, params: ${JSON.stringify(request.params)}`,
	);

	const { weekId, dayNumber }: GetDayRequestParams = dayRequestSchema.parse(
		request.params,
	);
	Logger.debug(`[getDay] Parsed weekId: ${weekId}, dayNumber: ${dayNumber}`);

	// Find the requested week
	const week = challengeWeeks.find((week) => week.id === weekId);
	if (!week) {
		Logger.warn(
			`[getDay] Week not found: weekId=${weekId}, dayNumber=${dayNumber}, userId=${userId}`,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.NOT_FOUND,
			message: "Week not found",
		};
		return response.status(StatusCodes.NOT_FOUND).json(apiResponse);
	}

	Logger.debug(`[getDay] Week found: ${week.title} (weekId: ${weekId})`);

	// Fetch user's notes for this day if they exist
	Logger.debug(
		`[getDay] Fetching daily progress notes for userId: ${userId}, weekId: ${weekId}, dayNumber: ${dayNumber}`,
	);
	const userDailyProgress = await db
		.select({ notes: dailyWeekProgress.notes })
		.from(dailyWeekProgress)
		.where(
			and(
				eq(dailyWeekProgress.userId, userId),
				eq(dailyWeekProgress.weekId, weekId),
				eq(dailyWeekProgress.dayNumber, dayNumber),
			),
		)
		.limit(1);

	const savedNotes = userDailyProgress[0]?.notes || null;
	Logger.debug(
		`[getDay] Notes retrieved: ${savedNotes ? `found (${savedNotes.length} chars)` : "not found"}`,
	);

	// Extract prompts and mantras for the specific day
	const prompts = week.prompts.find((prompt) => prompt.day === dayNumber);
	const mantras = week.mantras.find((mantra) => mantra.day === dayNumber);

	Logger.debug(
		`[getDay] Day content retrieved: prompts=${prompts ? "found" : "not found"}, mantras=${mantras ? "found" : "not found"}`,
	);

	const responseData: GetDayResponseData = {
		day: dayNumber,
		title: week.title,
		description: week.description,
		prompts,
		mantras,
		notes: savedNotes,
	};

	const apiResponse: ApiResponse<GetDayResponseData> = {
		code: StatusCodes.OK,
		message: "Day fetched successfully",
		data: responseData,
	};

	Logger.info(
		`[getDay] Request completed successfully for userId: ${userId}, weekId: ${weekId}, dayNumber: ${dayNumber}`,
	);
	return response.status(StatusCodes.OK).json(apiResponse);
};

/**
 * Create or update daily progress for a specific week and day
 *
 * Logic:
 * 1. Validates request parameters (weekId, dayNumber) and body (notes)
 * 2. Uses database transaction to ensure atomicity (userId available from auth middleware):
 *    a. Saves/updates daily progress entry (handles duplicate entries gracefully)
 *    b. Calculates and updates user streak statistics:
 *       - If user already logged today: skip stats update (prevent double-counting)
 *       - If user logged yesterday: increment current streak, update longest if needed
 *       - If user missed a day: reset current streak to 1, keep longest streak unchanged
 *    c. Creates new stats record if user doesn't have one yet
 *    d. Checks if all days in the week are completed:
 *       - If yes, marks the week as completed (sets completedAt timestamp)
 *       - Unlocks the next week by creating/updating weekProgress entry
 *
 * Streak Calculation Logic:
 * - SCENARIO A: User already logged today → Don't update stats (prevent duplicate streak increment)
 * - SCENARIO B: User logged yesterday → Continue streak (increment current, update longest if needed)
 * - SCENARIO C: User missed a day → Reset current streak to 1, preserve longest streak
 *
 * Week Completion Logic:
 * - After saving daily progress, checks if user has completed all days in the week
 * - If all days completed and week not already marked as completed:
 *   - Sets completedAt timestamp on weekProgress entry
 *   - Unlocks the next week (creates weekProgress entry if it doesn't exist)
 *
 * @returns Success message confirming progress was saved
 */
export const createDailyProgress = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	Logger.debug(
		`[createDailyProgress] Request started for userId: ${userId}, params: ${JSON.stringify(request.params)}, body: ${JSON.stringify(request.body)}`,
	);

	// Params are validated by middleware, parse to get typed data
	const { weekId, dayNumber }: CreateDailyProgressRequestParams =
		dailyProgressParamSchema.parse(request.params);
	// Body is validated by middleware, parse to get typed data
	const { notes }: CreateDailyProgressRequestBody =
		dailyProgressBodySchema.parse(request.body);
	Logger.info(
		`[createDailyProgress] Starting transaction for userId: ${userId}, weekId: ${weekId}, dayNumber: ${dayNumber}, hasNotes: ${!!notes}`,
	);

	// Use database transaction to ensure atomicity
	// If any operation fails, all changes are rolled back
	await db.transaction(async (tx) => {
		Logger.debug(
			`[createDailyProgress] Transaction started for userId: ${userId}, weekId: ${weekId}, dayNumber: ${dayNumber}`,
		);

		// STEP 1: Save or update the daily progress entry
		// Uses onConflictDoUpdate to handle duplicate entries gracefully
		// If user already logged this day, only update the notes (prevents errors on double-save)
		Logger.debug(
			`[createDailyProgress] STEP 1: Saving daily progress entry for userId: ${userId}, weekId: ${weekId}, dayNumber: ${dayNumber}`,
		);
		await tx
			.insert(dailyWeekProgress)
			.values({
				userId,
				weekId,
				dayNumber,
				notes,
			})
			.onConflictDoUpdate({
				target: [
					dailyWeekProgress.userId,
					dailyWeekProgress.weekId,
					dailyWeekProgress.dayNumber,
				],
				set: { notes, updatedAt: new Date() },
			});
		Logger.info(
			`[createDailyProgress] STEP 1: Daily progress saved/updated for userId: ${userId}, weekId: ${weekId}, dayNumber: ${dayNumber}`,
		);

		// STEP 2: Fetch user statistics to calculate streak
		Logger.debug(
			`[createDailyProgress] STEP 2: Fetching user statistics for userId: ${userId}`,
		);
		const userStats = await tx
			.select()
			.from(statistics)
			.where(eq(statistics.userId, userId));

		const stat = userStats[0];
		const todayString = getTodayString(); // e.g., "2023-11-21"
		Logger.debug(
			`[createDailyProgress] STEP 2: User stats retrieved: ${stat ? `currentStreak=${stat.currentStreak}, longestStreak=${stat.longestStreak}, lastLogDate=${stat.lastLogDate}` : "no stats found"}, todayString: ${todayString}`,
		);

		// Initialize default values for new users
		let newCurrentStreak = 1;
		let newLongestStreak = 1;
		let shouldUpdateStats = true;
		let scenario = "NEW_USER";

		// STEP 3: Calculate streak based on last log date
		if (stat) {
			// Convert last log date to string format for comparison
			const lastLogDate = stat.lastLogDate ? new Date(stat.lastLogDate) : null;
			const lastLogString = lastLogDate
				? lastLogDate.toISOString().split("T")[0]
				: null;

			Logger.debug(
				`[createDailyProgress] STEP 3: Streak calculation - lastLogString: ${lastLogString}, todayString: ${todayString}`,
			);

			// SCENARIO A: User already logged today
			// Don't increment streak again (prevents double-counting)
			if (lastLogString === todayString) {
				scenario = "A_ALREADY_LOGGED_TODAY";
				shouldUpdateStats = false;
				Logger.info(
					`[createDailyProgress] STEP 3: SCENARIO A - User already logged today, skipping stats update`,
				);
			}
			// SCENARIO B or C: User logged yesterday or missed a day
			else {
				// Calculate yesterday's date string
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				const yesterdayString = yesterday.toISOString().split("T")[0];

				Logger.debug(
					`[createDailyProgress] STEP 3: Comparing with yesterday: ${yesterdayString}`,
				);

				// SCENARIO B: User logged yesterday - continue streak
				if (lastLogString === yesterdayString) {
					scenario = "B_CONTINUE_STREAK";
					newCurrentStreak = stat.currentStreak + 1;
					newLongestStreak = Math.max(newCurrentStreak, stat.longestStreak);
					Logger.info(
						`[createDailyProgress] STEP 3: SCENARIO B - Continuing streak: ${stat.currentStreak} → ${newCurrentStreak}, longest: ${stat.longestStreak} → ${newLongestStreak}`,
					);
				}
				// SCENARIO C: User missed a day - reset current streak
				else {
					scenario = "C_RESET_STREAK";
					newCurrentStreak = 1;
					// Longest streak remains unchanged (preserves user's best streak)
					newLongestStreak = stat.longestStreak;
					Logger.info(
						`[createDailyProgress] STEP 3: SCENARIO C - Reset streak: ${stat.currentStreak} → ${newCurrentStreak}, longest preserved: ${newLongestStreak}`,
					);
				}
			}
		} else {
			Logger.info(
				`[createDailyProgress] STEP 3: New user - initializing streaks to 1`,
			);
		}

		// STEP 4: Update or create statistics record
		if (shouldUpdateStats) {
			if (stat) {
				// Update existing statistics
				Logger.debug(
					`[createDailyProgress] STEP 4: Updating statistics for userId: ${userId}, currentStreak: ${newCurrentStreak}, longestStreak: ${newLongestStreak}`,
				);
				await tx
					.update(statistics)
					.set({
						currentStreak: newCurrentStreak,
						longestStreak: newLongestStreak,
						lastLogDate: new Date(),
					})
					.where(eq(statistics.userId, userId));
				Logger.info(
					`[createDailyProgress] STEP 4: Statistics updated successfully for userId: ${userId}`,
				);
			} else {
				// Create new statistics record for first-time user
				Logger.debug(
					`[createDailyProgress] STEP 4: Creating new statistics record for userId: ${userId}`,
				);
				await tx.insert(statistics).values({
					userId,
					currentStreak: 1,
					longestStreak: 1,
					lastLogDate: new Date(),
				});
				Logger.info(
					`[createDailyProgress] STEP 4: New statistics record created for userId: ${userId}`,
				);
			}
		} else {
			Logger.info(
				`[createDailyProgress] STEP 4: Skipping statistics update (scenario: ${scenario})`,
			);
		}

		// STEP 5: Check if week is completed and unlock next week if applicable
		Logger.debug(
			`[createDailyProgress] STEP 5: Checking week completion for userId: ${userId}, weekId: ${weekId}`,
		);

		// Find the current week from challenge data
		const currentWeek = challengeWeeks.find((w) => w.id === weekId);
		if (!currentWeek) {
			Logger.warn(
				`[createDailyProgress] STEP 5: Week not found in challenge data: weekId=${weekId}`,
			);
		} else {
			// Calculate the maximum day number in this week
			// Get all day numbers from all focus areas
			const allDays = currentWeek.focusAreas.flatMap((area) =>
				area.dailyChallenges.map((challenge) => challenge.day),
			);
			const maxDayInWeek = Math.max(...allDays);
			Logger.debug(
				`[createDailyProgress] STEP 5: Max day in week ${weekId}: ${maxDayInWeek}`,
			);

			// Count distinct day numbers the user has completed for this week
			// Optimized: Use database COUNT DISTINCT instead of loading all records and using Set
			const distinctDaysCompletedResult = await tx
				.select({
					count: sql<number>`cast(count(distinct ${dailyWeekProgress.dayNumber}) as integer)`,
				})
				.from(dailyWeekProgress)
				.where(
					and(
						eq(dailyWeekProgress.userId, userId),
						eq(dailyWeekProgress.weekId, weekId),
					),
				);

			const distinctDaysCompletedValue =
				distinctDaysCompletedResult[0]?.count ?? 0;
			Logger.debug(
				`[createDailyProgress] STEP 5: Distinct days completed: ${distinctDaysCompletedValue}/${maxDayInWeek}`,
			);

			// Check if all days are completed
			if (distinctDaysCompletedValue >= maxDayInWeek) {
				// Check if week is already marked as completed
				const existingWeekProgress = await tx
					.select()
					.from(weekProgress)
					.where(
						and(
							eq(weekProgress.userId, userId),
							eq(weekProgress.weekId, weekId),
						),
					)
					.limit(1);

				const weekProgressEntry = existingWeekProgress[0];

				// If week is not yet marked as completed, mark it now
				if (!weekProgressEntry?.completedAt) {
					Logger.info(
						`[createDailyProgress] STEP 5: Week ${weekId} completed! Marking as completed for userId: ${userId}`,
					);

					if (weekProgressEntry) {
						// Update existing week progress entry
						await tx
							.update(weekProgress)
							.set({ completedAt: new Date() })
							.where(
								and(
									eq(weekProgress.userId, userId),
									eq(weekProgress.weekId, weekId),
								),
							);
						Logger.info(
							`[createDailyProgress] STEP 5: Week ${weekId} marked as completed (updated existing entry)`,
						);
					} else {
						// Create new week progress entry with completedAt
						await tx.insert(weekProgress).values({
							userId,
							weekId,
							completedAt: new Date(),
							startedAt: new Date(),
							unlockedAt: new Date(),
						});
						Logger.info(
							`[createDailyProgress] STEP 5: Week ${weekId} marked as completed (created new entry)`,
						);
					}

					// Unlock the next week if it exists
					const nextWeekId = weekId + 1;
					const nextWeek = challengeWeeks.find((w) => w.id === nextWeekId);
					if (nextWeek) {
						Logger.info(
							`[createDailyProgress] STEP 5: Unlocking next week ${nextWeekId} for userId: ${userId}`,
						);

						// Insert or update week progress for next week
						// Use onConflictDoUpdate to handle case where entry might already exist
						// Check if entry already exists to preserve startedAt
						const existingNextWeekProgress = await tx
							.select()
							.from(weekProgress)
							.where(
								and(
									eq(weekProgress.userId, userId),
									eq(weekProgress.weekId, nextWeekId),
								),
							)
							.limit(1);

						if (existingNextWeekProgress[0]) {
							// Entry exists, just update unlockedAt
							await tx
								.update(weekProgress)
								.set({ unlockedAt: new Date() })
								.where(
									and(
										eq(weekProgress.userId, userId),
										eq(weekProgress.weekId, nextWeekId),
									),
								);
						} else {
							// Entry doesn't exist, create it
							await tx.insert(weekProgress).values({
								userId,
								weekId: nextWeekId,
								unlockedAt: new Date(),
								startedAt: new Date(),
							});
						}
						Logger.info(
							`[createDailyProgress] STEP 5: Next week ${nextWeekId} unlocked successfully`,
						);
					} else {
						Logger.debug(
							`[createDailyProgress] STEP 5: No next week found (weekId ${weekId} is the last week)`,
						);
					}
				} else {
					Logger.debug(
						`[createDailyProgress] STEP 5: Week ${weekId} already marked as completed`,
					);
				}
			} else {
				Logger.debug(
					`[createDailyProgress] STEP 5: Week ${weekId} not yet completed (${distinctDaysCompletedValue}/${maxDayInWeek} days)`,
				);
			}
		}

		Logger.info(
			`[createDailyProgress] Transaction completed successfully for userId: ${userId}, scenario: ${scenario}`,
		);
	});

	const responseData: CreateDailyProgressResponseData = {
		message: "Progress saved",
	};

	const apiResponse: ApiResponse<CreateDailyProgressResponseData> = {
		code: StatusCodes.OK,
		message: "Progress saved",
		data: responseData,
	};

	Logger.info(
		`[createDailyProgress] Request completed successfully for userId: ${userId}, weekId: ${weekId}, dayNumber: ${dayNumber}`,
	);
	return response.status(StatusCodes.OK).json(apiResponse);
};
