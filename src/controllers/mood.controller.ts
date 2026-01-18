import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { db } from "../db";
import { mood } from "../db/schema/mood";
import type {
	CreateMoodResponseData,
	GetMoodResponseData,
	MoodEntry,
} from "../types/mood.types";
import {
	createMoodRequestSchema,
	getMoodRequestSchema,
} from "../types/mood.types";
import type { ApiResponse } from "../types/response";
import { getTodayString } from "../utils/helper";
import Logger from "../utils/logger";
import { generateMoodRecommendation } from "../utils/ai";


export const createOrUpdateMood = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	Logger.debug(`[createOrUpdateMood] Request started for userId: ${userId}`);

	const { mood_id, date, energy, state, pressure_point } =
		createMoodRequestSchema.parse(request.body);
	const moodDate = date || getTodayString();

	Logger.debug(
		`[createOrUpdateMood] Creating/updating mood for userId: ${userId}, mood_id: ${mood_id}, date: ${moodDate}`,
	);

	// Generate recommendation if we have the full context
	let recommendation: string | null = null;
	if (energy && state && pressure_point) {
		try {
			recommendation = await generateMoodRecommendation(
				energy,
				state,
				pressure_point,
			);
		} catch (error) {
			Logger.warn(
				`[createOrUpdateMood] Failed to generate recommendation: ${error}`,
			);
		}
	}

	// Upsert mood entry using onConflictDoUpdate
	const [moodEntry] = await db
		.insert(mood)
		.values({
			userId,
			mood_id,
			energy: energy || null,
			state: state ? JSON.stringify(state) : null, // Store as JSON string if array
			pressure_point: pressure_point || null,
			recommendation: recommendation || null,
			date: moodDate as string,
		})
		.onConflictDoUpdate({
			target: [mood.userId, mood.date],
			set: {
				mood_id,
				energy: energy || null,
				state: state ? JSON.stringify(state) : null,
				pressure_point: pressure_point || null,
				recommendation: recommendation || null,
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
};

export const getTodayMood = async (request: Request, response: Response) => {
	const { userId } = request;
	const today: string = getTodayString();
	Logger.debug(
		`[getTodayMood] Request started for userId: ${userId}, date: ${today}`,
	);

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
};

export const getMoodByDate = async (request: Request, response: Response) => {
	const { userId } = request;
	Logger.debug(`[getMoodByDate] Request started for userId: ${userId}`);

	const { date } = getMoodRequestSchema.parse(request.params);

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
};
