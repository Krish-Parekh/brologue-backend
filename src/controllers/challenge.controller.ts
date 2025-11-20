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
import { eq } from "drizzle-orm";
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

export const getAllWeeks = async (_req: Request, res: Response) => {
	try {
		const weeks = challengeWeeks.map((week) => {
			return {
				id: week.id,
				title: week.title,
				theme: week.theme,
				unlocked: week.unlocked,
			};
		});
		const response: ApiResponse<typeof weeks> = {
			code: StatusCodes.OK,
			message: "Challenges fetched successfully",
			data: weeks,
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
		const { success, data } = dailyProgressParamSchema.safeParse(req.params);
		const { success: bodySuccess, data: bodyData } = dailyProgressBodySchema.safeParse(req.body);
		if (!success || !bodySuccess) {
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId, dayNumber } = data;
		const { notes } = bodyData;
		const { userId } = getAuth(req);
		if (!userId) {
			const response: ApiResponse<null> = {
				code: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			};
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}

		// 1. THE SAFEGUARD (Transaction)
		// Think of this like a "Sandbox". If anything inside fails, 
		// the database undoes everything. It prevents "half-saved" data.
		await db.transaction(async (tx) => {

			// --- STEP 2: Save the User's Log ---
			await tx.insert(dailyWeekProgress)
				.values({
					userId,
					weekId,
					dayNumber,
					notes,
				})
				// If they already logged this day, just update the notes.
				// We don't want to crash if they click "Save" twice.
				.onConflictDoUpdate({
					target: [dailyWeekProgress.userId, dailyWeekProgress.weekId, dailyWeekProgress.dayNumber],
					set: { notes, updatedAt: new Date() },
				});

			// --- STEP 3: Get Current Stats ---
			// We need to see their history to calculate the new streak.
			const userStats = await tx
				.select()
				.from(statistics)
				.where(eq(statistics.userId, userId));

			const stat = userStats[0];
			const todayString = getTodayString(); // e.g., "2023-11-21"

			// Default values for a brand new user
			let newCurrentStreak = 1;
			let newLongestStreak = 1;
			let shouldUpdateStats = true;

			// --- STEP 4: The Streak Logic (Simplified) ---
			if (stat) {
				// We store dates as simple strings or Date objects in DB. 
				// Let's turn the DB date into a string "YYYY-MM-DD" to compare easily.
				const lastLogDate = stat.lastLogDate ? new Date(stat.lastLogDate) : null;
				const lastLogString = lastLogDate ? lastLogDate.toISOString().split('T')[0] : null;

				// SCENARIO A: They already logged today.
				if (lastLogString === todayString) {
					shouldUpdateStats = false; // Don't increase streak twice in one day!
				}
				// SCENARIO B: They logged Yesterday. (Streak continues!)
				else {
					// Check if the last log was exactly 1 day ago.
					// We calculate this by getting Yesterday's date string.
					const yesterday = new Date();
					yesterday.setDate(yesterday.getDate() - 1);
					const yesterdayString = yesterday.toISOString().split('T')[0];

					if (lastLogString === yesterdayString) {
						newCurrentStreak = stat.currentStreak + 1;
						newLongestStreak = Math.max(newCurrentStreak, stat.longestStreak);
					}
					// SCENARIO C: They missed a day. (Streak resets)
					else {
						newCurrentStreak = 1;
						// Longest streak stays the same, it doesn't reset.
						newLongestStreak = stat.longestStreak;
					}
				}
			}

			if (shouldUpdateStats) {
				if (stat) {
					await tx.update(statistics)
						.set({
							currentStreak: newCurrentStreak,
							longestStreak: newLongestStreak,
							lastLogDate: new Date(),
						})
						.where(eq(statistics.userId, userId));
				} else {
					await tx.insert(statistics).values({
						userId,
						currentStreak: 1,
						longestStreak: 1,
						lastLogDate: new Date(),
					});
				}
			}
		});

		return res.status(200).json({ message: "Progress saved" });
	}
	catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
}
