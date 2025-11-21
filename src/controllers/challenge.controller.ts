import type { Request, Response } from "express";
import { challengeWeeks } from "../data/challenge";
import type { ApiResponse } from "../types/response";
import type { Week } from "../types/challenge";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { z } from "zod";
import { getAuth } from "@clerk/express";
import { db } from "../db";
import { dailyWeekProgress } from "../db/schema/daily_week_progress";
import { statistics } from "../db/schema/statistics";
import { weekProgress } from "../db/schema/week_progress";
import { eq, and } from "drizzle-orm";
import { getTodayString } from "../utils/helper";

const weekRequestSchema = z
	.object({
		weekId: z.string().transform((val) => parseInt(val)),
	})
	.strict();

const dayRequestSchema = z
	.object({
		weekId: z.string().transform((val) => parseInt(val)),
		dayNumber: z.string().transform((val) => parseInt(val)),
	})
	.strict();




export const getAllWeeks = async (req: Request, res: Response) => {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			const response: ApiResponse<null> = {
				code: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			};
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}

		const [userStats] = await db
			.select()
			.from(statistics)
			.where(eq(statistics.userId, userId));

		const userWeeks = await db
			.select()
			.from(weekProgress)
			.where(eq(weekProgress.userId, userId));

		const currentWeekObj = userWeeks.sort((a, b) => b.weekId - a.weekId)[0];
		const currentWeekId = currentWeekObj ? currentWeekObj.weekId : 1;

		const currentWeekProgress = await db
			.select()
			.from(dailyWeekProgress)
			.where(
				and(
					eq(dailyWeekProgress.userId, userId),
					eq(dailyWeekProgress.weekId, currentWeekId),
				),
			);

		const weekProgressCount = currentWeekProgress.length;
		const totalWeeksCompleted = userWeeks.filter((w) => w.completedAt).length;
		const dayStreak = userStats ? userStats.currentStreak : 0;

		const weeks = challengeWeeks.map((week) => {
			const isUnlocked =
				userWeeks.some((uw) => uw.weekId === week.id) || week.id === 1;
			return {
				...week,
				unlocked: isUnlocked,
			};
		});

		const responseData = {
			currentWeek: currentWeekId,
			dayStreak,
			totalWeeksCompleted,
			weekProgress: weekProgressCount,
			weeks,
		};

		const response: ApiResponse<typeof responseData> = {
			code: StatusCodes.OK,
			message: "Challenges fetched successfully",
			data: responseData,
		};
		return res.status(StatusCodes.OK).json(response);
	} catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

export const getWeek = async (req: Request, res: Response) => {
	try {
		const { success, data } = weekRequestSchema.safeParse(req.params);
		if (!success) {
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId } = data;
		const week = challengeWeeks.find((week) => week.id === weekId);
		if (!week) {
			const response: ApiResponse<null> = {
				code: StatusCodes.NOT_FOUND,
				message: "Week not found",
			};
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response: ApiResponse<Week> = {
			code: StatusCodes.OK,
			message: "Week fetched successfully",
			data: week,
		};
		return res.status(StatusCodes.OK).json(response);
	} catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: "Failed to get week",
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

export const getDay = async (req: Request, res: Response) => {
	try {
		const { success, data } = dayRequestSchema.safeParse(req.params);
		if (!success) {
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId, dayNumber } = data;
		const week = challengeWeeks.find((week) => week.id === weekId);
		if (!week) {
			const response: ApiResponse<null> = {
				code: StatusCodes.NOT_FOUND,
				message: "Week not found",
			};
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}
		const prompts = week.prompts.find((prompt) => prompt.day === dayNumber);
		const mantras = week.mantras.find((mantra) => mantra.day === dayNumber);
		const payload = {
			day: dayNumber,
			title: week.title,
			description: week.description,
			prompts,
			mantras,
		};
		const response: ApiResponse<typeof payload> = {
			code: StatusCodes.OK,
			message: "Day fetched successfully",
			data: payload,
		};

		return res.status(StatusCodes.OK).json(response);
	} catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

const dailyProgressParamSchema = z
	.object({
		weekId: z.string().transform((val) => parseInt(val)),
		dayNumber: z.string().transform((val) => parseInt(val)),
	})
	.strict();

const dailyProgressBodySchema = z
	.object({
		notes: z.string().optional(),
	})
	.strict();

export const createDailyProgress = async (req: Request, res: Response) => {
	try {
		console.log("Params", req.params);
		const {
			success,
			data,
			error: paramError,
		} = dailyProgressParamSchema.safeParse(req.params);
		console.log("Param Error", paramError);

		console.log("Body", req.body);
		const {
			success: bodySuccess,
			data: bodyData,
			error: bodyError,
		} = dailyProgressBodySchema.safeParse(req.body);
		console.log("Body Error", bodyError);
		if (!success || !bodySuccess) {
			console.log("Error", paramError, bodyError);
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId, dayNumber } = data;
		const { notes } = bodyData;
		const { userId } = getAuth(req);
		console.log("UserId", userId);
		if (!userId) {
			const response: ApiResponse<null> = {
				code: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			};
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}
		console.log("Starting daily progress creation transaction");

		// 1. THE SAFEGUARD (Transaction)
		// Think of this like a "Sandbox". If anything inside fails,
		// the database undoes everything. It prevents "half-saved" data.
		await db.transaction(async (tx) => {
			console.log("Inside transaction - starting database operations");

			// --- STEP 2: Save the User's Log ---
			console.log("Inserting daily progress with values:", {
				userId,
				weekId,
				dayNumber,
				notes,
			});
			await tx
				.insert(dailyWeekProgress)
				.values({
					userId,
					weekId,
					dayNumber,
					notes,
				})
				// If they already logged this day, just update the notes.
				// We don't want to crash if they click "Save" twice.
				.onConflictDoUpdate({
					target: [
						dailyWeekProgress.userId,
						dailyWeekProgress.weekId,
						dailyWeekProgress.dayNumber,
					],
					set: { notes, updatedAt: new Date() },
				});

			console.log("Daily Week Progress Saved successfully");

			// --- STEP 3: Get Current Stats ---
			// We need to see their history to calculate the new streak.
			console.log("Fetching user statistics for userId:", userId);
			const userStats = await tx
				.select()
				.from(statistics)
				.where(eq(statistics.userId, userId));

			const stat = userStats[0];
			const todayString = getTodayString(); // e.g., "2023-11-21"

			console.log("User Stats retrieved:", userStats);
			console.log("Today string:", todayString);
			console.log("Current stat object:", stat);

			// Default values for a brand new user
			let newCurrentStreak = 1;
			let newLongestStreak = 1;
			let shouldUpdateStats = true;

			console.log(
				"Initial streak values - newCurrentStreak:",
				newCurrentStreak,
				"newLongestStreak:",
				newLongestStreak,
			);

			// --- STEP 4: The Streak Logic (Simplified) ---
			if (stat) {
				console.log("User has existing stats, processing streak logic");
				// We store dates as simple strings or Date objects in DB.
				// Let's turn the DB date into a string "YYYY-MM-DD" to compare easily.
				const lastLogDate = stat.lastLogDate
					? new Date(stat.lastLogDate)
					: null;
				const lastLogString = lastLogDate
					? lastLogDate.toISOString().split("T")[0]
					: null;

				console.log("Last log date from DB:", stat.lastLogDate);
				console.log("Last log date as Date object:", lastLogDate);
				console.log("Last log string:", lastLogString);

				// SCENARIO A: They already logged today.
				if (lastLogString === todayString) {
					console.log(
						"SCENARIO A: User already logged today, not updating stats",
					);
					shouldUpdateStats = false; // Don't increase streak twice in one day!
				}
				// SCENARIO B: They logged Yesterday. (Streak continues!)
				else {
					console.log(
						"SCENARIO B/C: Checking if logged yesterday or streak should reset",
					);
					// Check if the last log was exactly 1 day ago.
					// We calculate this by getting Yesterday's date string.
					const yesterday = new Date();
					yesterday.setDate(yesterday.getDate() - 1);
					const yesterdayString = yesterday.toISOString().split("T")[0];

					console.log("Yesterday string:", yesterdayString);

					if (lastLogString === yesterdayString) {
						console.log("SCENARIO B: User logged yesterday, continuing streak");
						newCurrentStreak = stat.currentStreak + 1;
						newLongestStreak = Math.max(newCurrentStreak, stat.longestStreak);
						console.log(
							"Updated streak values - newCurrentStreak:",
							newCurrentStreak,
							"newLongestStreak:",
							newLongestStreak,
						);
					}
					// SCENARIO C: They missed a day. (Streak resets)
					else {
						console.log(
							"SCENARIO C: User missed a day, resetting current streak",
						);
						newCurrentStreak = 1;
						// Longest streak stays the same, it doesn't reset.
						newLongestStreak = stat.longestStreak;
						console.log(
							"Reset streak values - newCurrentStreak:",
							newCurrentStreak,
							"newLongestStreak:",
							newLongestStreak,
						);
					}
				}
			} else {
				console.log("User has no existing stats, will create new record");
			}

			console.log("Final shouldUpdateStats:", shouldUpdateStats);

			if (shouldUpdateStats) {
				if (stat) {
					console.log("Updating existing statistics record");
					await tx
						.update(statistics)
						.set({
							currentStreak: newCurrentStreak,
							longestStreak: newLongestStreak,
							lastLogDate: new Date(),
						})
						.where(eq(statistics.userId, userId));
					console.log("Statistics updated successfully");
				} else {
					console.log("Creating new statistics record");
					await tx.insert(statistics).values({
						userId,
						currentStreak: 1,
						longestStreak: 1,
						lastLogDate: new Date(),
					});
					console.log("New statistics record created successfully");
				}
			} else {
				console.log("Skipping statistics update");
			}

			console.log("Transaction completed successfully");
		});

		console.log("Daily progress creation completed, sending response");
		return res.status(200).json({ message: "Progress saved" });
	} catch (error) {
		console.error("Error creating daily progress:", error);
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
