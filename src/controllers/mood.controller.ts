import { and, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { db } from "../db";
import { mood } from "../db/schema/mood";
import type {
	CreateMoodResponseData,
	GetMoodResponseData,
	MoodEntry,
} from "../types/mood.types";
import type { ApiResponse } from "../types/response";
import { getTodayString } from "../utils/helper";
import Logger from "../utils/logger";

// ============================================================================
// Validation Schemas
// ============================================================================

const createMoodRequestSchema = z
	.object({
		mood_id: z.string().min(1, "mood_id is required"),
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
			.optional(),
	})
	.strict();

const getMoodRequestSchema = z
	.object({
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	})
	.strict();

// ============================================================================
// Controllers
// ============================================================================

/**
 * Create or update a mood entry for a specific date
 *
 * Logic:
 * 1. Validates request body (mood_id required, date optional - defaults to today)
 * 2. Uses onConflictDoUpdate to upsert mood entry
 * 3. If entry exists for that date, updates mood_id and updatedAt
 * 4. If entry doesn't exist, creates new entry
 *
 * @route POST /api/v1/mood
 * @returns Created/updated mood entry
 */
export const createOrUpdateMood = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const { userId } = request;
	Logger.debug(`[createOrUpdateMood] Request started for userId: ${userId}`);

	try {
		// Validate request body
		const validationResult = createMoodRequestSchema.safeParse(request.body);
		if (!validationResult.success) {
			Logger.warn(
				`[createOrUpdateMood] Validation failed for userId: ${userId}, errors: ${JSON.stringify(validationResult.error.issues)}`,
			);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: "Invalid request body",
				data: null,
			};
			return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
		}

		const { mood_id, date } = validationResult.data;
		const moodDate = date || getTodayString();

		Logger.debug(
			`[createOrUpdateMood] Creating/updating mood for userId: ${userId}, mood_id: ${mood_id}, date: ${moodDate}`,
		);

		// Upsert mood entry using onConflictDoUpdate
		const [moodEntry] = await db
			.insert(mood)
			.values({
				userId,
				mood_id,
				date: moodDate as string,
			})
			.onConflictDoUpdate({
				target: [mood.userId, mood.date],
				set: {
					mood_id,
					updatedAt: new Date(),
				},
			})
			.returning();

		Logger.info(
			`[createOrUpdateMood] Mood entry created/updated successfully for userId: ${userId}, date: ${moodDate}`,
		);

		const apiResponse: ApiResponse<CreateMoodResponseData> = {
			code: StatusCodes.OK,
			message: "Mood entry saved successfully",
			data: {
				mood: moodEntry as MoodEntry,
			} as CreateMoodResponseData,
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		next(error);
	}
};

/**
 * Get mood entry for today
 *
 * @route GET /api/v1/mood
 * @returns Today's mood entry or null if not found
 */
export const getTodayMood = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const { userId } = request;
	const today: string = getTodayString();
	Logger.debug(
		`[getTodayMood] Request started for userId: ${userId}, date: ${today}`,
	);

	try {
		const [moodEntry] = await db
			.select()
			.from(mood)
			.where(and(eq(mood.userId, userId), eq(mood.date, today)))
			.limit(1);

		Logger.info(
			`[getTodayMood] Mood entry ${moodEntry ? "found" : "not found"} for userId: ${userId}, date: ${today}`,
		);

		const apiResponse: ApiResponse<GetMoodResponseData> = {
			code: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: {
				mood: moodEntry || null,
			},
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		next(error);
	}
};

/**
 * Get mood entry for a specific date
 *
 * @route GET /api/v1/mood/:date
 * @returns Mood entry for the specified date or null if not found
 */
export const getMoodByDate = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const { userId } = request;
	Logger.debug(`[getMoodByDate] Request started for userId: ${userId}`);

	try {
		// Validate request parameters
		const validationResult = getMoodRequestSchema.safeParse(request.params);
		if (!validationResult.success) {
			Logger.warn(
				`[getMoodByDate] Validation failed for userId: ${userId}, errors: ${JSON.stringify(validationResult.error.issues)}`,
			);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: "Invalid date parameter. Date must be in YYYY-MM-DD format",
				data: null,
			};
			return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
		}

		const { date } = validationResult.data;

		Logger.debug(
			`[getMoodByDate] Fetching mood for userId: ${userId}, date: ${date}`,
		);

		const [moodEntry] = await db
			.select()
			.from(mood)
			.where(and(eq(mood.userId, userId), eq(mood.date, date)))
			.limit(1);

		Logger.info(
			`[getMoodByDate] Mood entry ${moodEntry ? "found" : "not found"} for userId: ${userId}, date: ${date}`,
		);

		const apiResponse: ApiResponse<GetMoodResponseData> = {
			code: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: {
				mood: moodEntry || null,
			},
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		next(error);
	}
};
