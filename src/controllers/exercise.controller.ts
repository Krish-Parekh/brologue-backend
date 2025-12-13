import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { db } from "../db";
import { exercise } from "../db/schema/exercise";
import type {
	CreateExerciseSessionResponseData,
	ExerciseEntryData,
	GetExercisesResponseData,
} from "../types/exercise.types";
import type { ApiResponse } from "../types/response";
import { getTodayString } from "../utils/helper";
import Logger from "../utils/logger";

const exerciseEntrySchema = z
	.object({
		exerciseId: z.string().min(1, "exerciseId is required"),
		completed: z.boolean(),
	})
	.strict();

const createExerciseSessionRequestSchema = z
	.object({
		exercises: z
			.array(exerciseEntrySchema)
			.min(1, "At least one exercise is required"),
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
			.optional(),
	})
	.strict();

const getExerciseRequestSchema = z
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
 * Create or update exercise session for a specific date
 *
 * Logic:
 * 1. Validates request body (exercises array required, date optional - defaults to today)
 * 2. Upserts each exercise entry using onConflictDoUpdate
 * 3. Returns all exercise entries for the date
 *
 * @route POST /api/v1/exercise
 * @returns Created/updated exercise entries
 */
export const createOrUpdateExerciseSession = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	Logger.debug(
		`[createOrUpdateExerciseSession] Request started for userId: ${userId}`,
	);

	try {
		// Validate request body
		const validationResult = createExerciseSessionRequestSchema.safeParse(
			request.body,
		);
		if (!validationResult.success) {
			console.log(
				`validationResult: ${JSON.stringify(validationResult.error.issues)}`,
			);
			Logger.warn(
				`[createOrUpdateExerciseSession] Validation failed for userId: ${userId}, errors: ${JSON.stringify(validationResult.error.issues)}`,
			);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: "Invalid request body",
				data: null,
			};
			return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
		}

		const { exercises, date } = validationResult.data;
		const exerciseDate = date || getTodayString();

		Logger.debug(
			`[createOrUpdateExerciseSession] Creating/updating exercise session for userId: ${userId}, date: ${exerciseDate}, exercises count: ${exercises.length}`,
		);

		// Upsert each exercise entry
		const exerciseEntries: ExerciseEntryData[] = [];

		for (const exerciseEntry of exercises) {
			const [entry] = await db
				.insert(exercise)
				.values({
					userId,
					date: exerciseDate as string,
					exerciseId: exerciseEntry.exerciseId,
					completed: exerciseEntry.completed,
				})
				.onConflictDoUpdate({
					target: [exercise.userId, exercise.date, exercise.exerciseId],
					set: {
						completed: exerciseEntry.completed,
						updatedAt: new Date(),
					},
				})
				.returning();

			exerciseEntries.push(entry as ExerciseEntryData);
		}

		Logger.info(
			`[createOrUpdateExerciseSession] Exercise session created/updated successfully for userId: ${userId}, date: ${exerciseDate}, entries count: ${exerciseEntries.length}`,
		);

		const apiResponse: ApiResponse<CreateExerciseSessionResponseData> = {
			code: StatusCodes.OK,
			message: "Exercise session saved successfully",
			data: {
				exercises: exerciseEntries,
			},
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		Logger.error(
			`[createOrUpdateExerciseSession] Error creating/updating exercise session for userId: ${userId}, error: ${error instanceof Error ? error.message : String(error)}`,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
			data: null,
		};
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
	}
};

/**
 * Get exercise entries for today
 *
 * @route GET /api/v1/exercise
 * @returns Today's exercise entries (empty array if none found)
 */
export const getTodayExercises = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	const today: string = getTodayString();
	Logger.debug(
		`[getTodayExercises] Request started for userId: ${userId}, date: ${today}`,
	);

	try {
		const exerciseEntries = await db
			.select()
			.from(exercise)
			.where(and(eq(exercise.userId, userId), eq(exercise.date, today)));

		Logger.info(
			`[getTodayExercises] Found ${exerciseEntries.length} exercise entries for userId: ${userId}, date: ${today}`,
		);

		const apiResponse: ApiResponse<GetExercisesResponseData> = {
			code: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: {
				exercises: exerciseEntries as ExerciseEntryData[],
			},
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		Logger.error(
			`[getTodayExercises] Error fetching exercises for userId: ${userId}, error: ${error instanceof Error ? error.message : String(error)}`,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
			data: null,
		};
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
	}
};

/**
 * Get exercise entries for a specific date
 *
 * @route GET /api/v1/exercise/:date
 * @returns Exercise entries for the specified date (empty array if none found)
 */
export const getExercisesByDate = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	Logger.debug(`[getExercisesByDate] Request started for userId: ${userId}`);

	try {
		// Validate request parameters
		const validationResult = getExerciseRequestSchema.safeParse(request.params);
		if (!validationResult.success) {
			Logger.warn(
				`[getExercisesByDate] Validation failed for userId: ${userId}, errors: ${JSON.stringify(validationResult.error.issues)}`,
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
			`[getExercisesByDate] Fetching exercises for userId: ${userId}, date: ${date}`,
		);

		const exerciseEntries = await db
			.select()
			.from(exercise)
			.where(and(eq(exercise.userId, userId), eq(exercise.date, date)));

		Logger.info(
			`[getExercisesByDate] Found ${exerciseEntries.length} exercise entries for userId: ${userId}, date: ${date}`,
		);

		const apiResponse: ApiResponse<GetExercisesResponseData> = {
			code: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: {
				exercises: exerciseEntries as ExerciseEntryData[],
			},
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		Logger.error(
			`[getExercisesByDate] Error fetching exercises for userId: ${userId}, error: ${error instanceof Error ? error.message : String(error)}`,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
			data: null,
		};
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
	}
};